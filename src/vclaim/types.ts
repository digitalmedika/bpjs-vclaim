import type { VClaim } from './vclaim.js';
import type { CamelResponse, VClaimConfig, VClaimConfigInput, VClaimResponse } from '../core/types.js';

export type { CamelResponse, VClaimConfig, VClaimConfigInput, VClaimResponse };

export type VClaimServices = VClaim;
export type VClaimServiceName = keyof VClaimServices;
export type VClaimService<T extends VClaimServiceName> = VClaimServices[T];
export type VClaimParams<T extends VClaimServiceName, M extends keyof VClaimServices[T]> = Parameters<VClaimServices[T][M]>;
export type VClaimResult<T extends VClaimServiceName, M extends keyof VClaimServices[T]> = Awaited<ReturnType<VClaimServices[T][M]>>;
