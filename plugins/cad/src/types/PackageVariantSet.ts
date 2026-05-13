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
import { PackageVariantUpstream } from './PackageVariant';

export type PackageVariantSet = {
  kind: string;
  apiVersion: string;
  metadata: PackageVariantSetMetadata;
  spec: PackageVariantSetSpec;
};

export type PackageVariantSetMetadata = {
  name: string;
  namespace?: string;
  labels?: KubernetesKeyValueObject;
  annotations?: KubernetesKeyValueObject;
};

export type ConfigMapExpr = {
  key?: string;
  value?: string;
  keyExpr?: string;
  valueExpr?: string;
};

export type PackageVariantSetSpec = {
  upstream: PackageVariantUpstream;
  targets: PackageVariantSetTargets[];
};

export type PackageVariantSetTargets = {
  repositories?: PackageVariantSetRepositories[];
  repositorySelector?: PackageVariantSetRepositorySelector;
  objectSelector?: PackageVariantSetObjectSelector;
  template?: PackageVariantSetTempleate;
};

export type PackageVariantSetRepositories = {
  name: string;
  packageNames?: string[];
};

export type PackageVariantSetRepositorySelector = {
  matchLabels: KubernetesKeyValueObject;
};

export type PackageVariantSetObjectSelector = {
  name?: string;
  matchLabels: KubernetesKeyValueObject;
  apiVersion: string;
  kind: string;
};

export type PackageVariantSetTempleate = {
  downstream?: PackageVariantSetDownstream;
  adoptionPolicy?: string;
  deletionPolicy?: string;
  labels?: KubernetesKeyValueObject;
  labelExprs?: ConfigMapExpr[];
  annotations?: KubernetesKeyValueObject;
  annotationExprs?: ConfigMapExpr[];
  packageContext?: PackageVariantSetPackageContext;
  pipeline?: KptfilePipeline;
  injectors?: PackageVariantSetInjectors;
};

export type PackageVariantSetDownstream = {
  repo?: string;
  package?: string;
  repoExpr?: string;
  packageExpr?: string;
};

export type PackageVariantSetPackageContext = {
  data?: KubernetesKeyValueObject;
  removeKeys?: string[];
  dataExprs?: ConfigMapExpr[];
  removeKeyExprs?: string[];
};

export type PackageVariantSetInjectors = {
  group?: string;
  version?: string;
  kind?: string;
  name: string;
  nameExpr?: string;
};
