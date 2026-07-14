/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import express, { Router } from 'express';
import https from 'node:https';
import {
  ClusterLocatorAuthProvider,
  getClusterLocatorMethodAuthProvider,
  getClusterLocatorMethodOIDCTokenProvider,
  getClusterLocatorMethodServiceAccountToken,
  getClusterLocatorMethodType,
  getGitOpsDeliveryTool,
  getMaxRequestSize,
  getResourcesNamespace,
  OIDCTokenProvider,
} from './config';
import { getKubernetesConfig } from './lib';

export interface RouterOptions {
  config: Config;
  logger: LoggerService;
}

const getClientAuthentication = (
  authProvider: ClusterLocatorAuthProvider,
  oidcTokenProvider: OIDCTokenProvider,
): string => {
  switch (authProvider) {
    case ClusterLocatorAuthProvider.GOOGLE:
      return 'google';

    case ClusterLocatorAuthProvider.OIDC:
      switch (oidcTokenProvider) {
        case OIDCTokenProvider.GOOGLE:
          return 'oidc.google';

        case OIDCTokenProvider.OKTA:
          return 'oidc.okta';

        default:
          throw new Error(`Client authenticaiton cannot be determined for OIDC token provider ${oidcTokenProvider}`);
      }

    case ClusterLocatorAuthProvider.SERVICE_ACCOUNT:
    case ClusterLocatorAuthProvider.CURRENT_CONTEXT:
    case ClusterLocatorAuthProvider.NONE:
      return 'none';

    default:
      throw new Error(`Client authenticaiton cannot be determined for auth provider ${authProvider}`);
  }
};

export async function createRouter({ config, logger }: RouterOptions): Promise<express.Router> {
  const cadConfig = config.getConfig('configAsData');

  const namespace = getResourcesNamespace(cadConfig);
  const gitOpsTool = getGitOpsDeliveryTool(cadConfig);
  const maxRequestSize = getMaxRequestSize(cadConfig);

  const clusterLocatorMethodType = getClusterLocatorMethodType(cadConfig);
  const clusterLocatorMethodAuthProvider = getClusterLocatorMethodAuthProvider(cadConfig);
  const oidcTokenProvider = getClusterLocatorMethodOIDCTokenProvider(cadConfig);

  const kubeConfig = getKubernetesConfig(clusterLocatorMethodType);
  const currentCluster = kubeConfig.getCurrentCluster();

  if (!currentCluster) {
    throw new Error(`Current cluster is not set`);
  }

  const serviceAccountToken = getClusterLocatorMethodServiceAccountToken(cadConfig);

  const clientAuthentication = getClientAuthentication(clusterLocatorMethodAuthProvider, oidcTokenProvider);

  logger.info(`Using '${clientAuthentication}' for client authentication`);
  logger.info(`Using '${namespace}' as the resources namespace`);

  const k8sApiServerUrl = currentCluster.server;

  // Set up TLS options for the Kubernetes API server connection
  const httpsOptions: Record<string, unknown> = {};
  await kubeConfig.applyToHTTPSOptions(httpsOptions);
  const k8sAgent = new https.Agent({
    ca: httpsOptions.ca as string | Buffer | undefined,
    cert: httpsOptions.cert as string | Buffer | undefined,
    key: httpsOptions.key as string | Buffer | undefined,
  });
  const k8sAuthHeaders: Record<string, string> = {};
  if (httpsOptions.headers && typeof httpsOptions.headers === 'object') {
    Object.assign(k8sAuthHeaders, httpsOptions.headers);
  }

  const healthCheck = (_: express.Request, response: express.Response): void => {
    response.send({ status: 'ok' });
  };

  const getFeatures = (_: express.Request, response: express.Response): void => {
    response.send({
      authentication: clientAuthentication,
      namespace: namespace,
      gitOps: gitOpsTool,
    });
  };

  const getFunctionCatalog = async (_: express.Request, response: express.Response): Promise<void> => {
    try {
      const catalogResponse = await fetch('https://catalog.kpt.dev/catalog-v2.json');
      const catalogBody = await catalogResponse.text();
      response.status(catalogResponse.status).send(catalogBody);
    } catch (error) {
      response.status(500).send({ error: 'Failed to fetch function catalog' });
    }
  };

  const proxyKubernetesRequest = async (request: express.Request, response: express.Response): Promise<void> => {
    logger.info(`${request.method} ${request.url}`);

    const headers: Record<string, string> = {
      ...k8sAuthHeaders,
      'Content-Type': 'application/json',
    };

    const useEndUserAuthz = clientAuthentication !== 'none';
    if (useEndUserAuthz && request.headers.authorization) {
      headers.Authorization = request.headers.authorization;
    }

    const useServiceAccount = clusterLocatorMethodAuthProvider === ClusterLocatorAuthProvider.SERVICE_ACCOUNT;
    if (useServiceAccount) {
      headers.Authorization = `Bearer ${serviceAccountToken}`;
    }

    const body = request.body && Object.keys(request.body).length > 0 ? JSON.stringify(request.body) : undefined;

    try {
      const url = new URL(request.url, k8sApiServerUrl);
      const k8Body = await new Promise<{ statusCode: number; body: string }>((resolve, reject) => {
        const req = https.request(
          {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: request.method,
            headers,
            agent: k8sAgent,
          },
          res => {
            let data = '';
            res.on('data', chunk => (data += chunk));
            res.on('end', () => resolve({ statusCode: res.statusCode ?? 500, body: data }));
          },
        );
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
      });
      response.status(k8Body.statusCode).send(k8Body.body);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error(`Failed to proxy request: ${err.message}`);
      response.status(500).send({ error: 'Failed to proxy request to Kubernetes API' });
    }
  };

  const router = Router();
  router.use(express.json({ limit: maxRequestSize }));

  router.get('/health', healthCheck);
  router.get('/v1/features', getFeatures);
  router.get('/v1/function-catalog', getFunctionCatalog);

  router.get('/{*path}', proxyKubernetesRequest);
  router.post('/{*path}', proxyKubernetesRequest);
  router.put('/{*path}', proxyKubernetesRequest);
  router.patch('/{*path}', proxyKubernetesRequest);
  router.delete('/{*path}', proxyKubernetesRequest);

  return router;
}
