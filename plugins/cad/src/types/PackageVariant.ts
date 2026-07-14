/**
 * Copyright 2023 The kpt Authors
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

import { KptfilePipeline } from './Kptfile';
import { KubernetesKeyValueObject } from './KubernetesResource';

export type PackageVariant = {
  kind: string;
  apiVersion: string;
  metadata: PackageVariantMetadata;
  spec: PackageVariantSpec;
};

export type PackageVariantMetadata = {
  name: string;
  namespace?: string;
  labels?: KubernetesKeyValueObject;
  annotations?: KubernetesKeyValueObject;
};

export type PackageVariantSpec = {
  upstream: PackageVariantUpstream;
  downstream: PackageVariantDownstream;
  labels: KubernetesKeyValueObject;
  annotations?: KubernetesKeyValueObject;
  packageContext: PackageVariantPackageContext;
  adoptionPolicy?: string;
  deletionPolicy?: string;
  injectors?: PackageVariantInjectors;
  pipeline?: KptfilePipeline;
};

export type PackageVariantUpstream = {
  repo: string;
  package: string;
  revision?: string;
};

export type PackageVariantDownstream = {
  repo: string;
  package: string;
};

export type PackageVariantPackageContext = {
  data: KubernetesKeyValueObject;
  removeKeys?: string[];
};

export type PackageVariantInjectors = {
  group?: string;
  version?: string;
  kind?: string;
  name: string;
};
