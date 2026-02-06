export type VClaimMode = 'development' | 'production';
export type MaybePromise<T> = T | Promise<T>;

export type VClaimType = 'vclaim';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type PathParams = Record<string, string | number | boolean | null | undefined>;
export type RequestPath = string | [string, PathParams];

export interface SendOption {
  name?: string;
  path: RequestPath;
  method?: HttpMethod;
  data?: unknown;
  skipDecrypt?: boolean;
  headers?: Record<string, string>;
  /**
   * Default request header uses Application/x-www-form-urlencoded
   * even when body is JSON, to match the official BPJS docs.
   */
  skipContentTypeHack?: boolean;
}

export interface CamelResponse<T, C = string, E = unknown> {
  response: T;
  metaData: {
    code: C;
    message: string;
  } & E;
}

export type VClaimResponse<T, E = unknown> = CamelResponse<T | undefined, string, E>;

export interface BaseUrls {
  vclaim: {
    development: string;
    production: string;
  };
}

export interface VClaimConfig {
  mode: VClaimMode;
  ppkCode: string;
  consId: string;
  consSecret: string;
  vclaimUserKey: string;
  throw: boolean;
  baseUrls: BaseUrls;
}

export type VClaimConfigInput =
  | Partial<VClaimConfig>
  | (() => MaybePromise<Partial<VClaimConfig>>);
