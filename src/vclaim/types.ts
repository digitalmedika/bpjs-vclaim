import type { VClaim } from './vclaim.js';
import type { CamelResponse, VClaimConfig, VClaimConfigInput, VClaimResponse } from '../core/types.js';

export type { CamelResponse, VClaimConfig, VClaimConfigInput, VClaimResponse };

export type VClaimServices = VClaim;
export type VClaimServiceName = keyof VClaimServices;
export type VClaimService<T extends VClaimServiceName> = VClaimServices[T];

type MethodKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type MethodType<T, K extends keyof T> = Extract<T[K], (...args: any[]) => any>;

export type VClaimMethodName<T extends VClaimServiceName> = MethodKeys<VClaimServices[T]>;
export type VClaimParams<T extends VClaimServiceName, M extends VClaimMethodName<T>> = Parameters<MethodType<VClaimServices[T], M>>;
export type VClaimResult<T extends VClaimServiceName, M extends VClaimMethodName<T>> = Awaited<
  ReturnType<MethodType<VClaimServices[T], M>>
>;
