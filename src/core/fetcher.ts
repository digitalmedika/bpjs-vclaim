import lz from 'lz-string';
import { createDecipheriv, createHash, createHmac } from 'node:crypto';
import type {
  BaseUrls,
  MaybePromise,
  SendOption,
  VClaimConfig,
  VClaimConfigInput,
  VClaimResponse,
  VClaimType
} from './types.js';

const defaultBaseUrls: BaseUrls = {
  vclaim: {
    development: 'https://apijkn-dev.bpjs-kesehatan.go.id/vclaim-rest-dev',
    production: 'https://apijkn.bpjs-kesehatan.go.id/vclaim-rest'
  }
};

const defaultConfig: VClaimConfig = {
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
  ppkCode: process.env.JKN_PPK_CODE ?? '',
  consId: process.env.JKN_CONS_ID ?? '',
  consSecret: process.env.JKN_CONS_SECRET ?? '',
  vclaimUserKey: process.env.JKN_VCLAIM_USER_KEY ?? '',
  throw: false,
  baseUrls: defaultBaseUrls
};

export class VClaimFetcher {
  private readonly userConfig?: VClaimConfigInput;
  onRequest: ((info: SendOption & { type: VClaimType }) => MaybePromise<void>) | undefined;
  onResponse:
    | ((
        info: SendOption & {
          /** in milliseconds */
          duration: number;
          type: VClaimType;
        },
        result: VClaimResponse<unknown, unknown>
      ) => MaybePromise<void>)
    | undefined;
  onError: ((error: Error) => MaybePromise<void>) | undefined;
  private configured = false;
  private config: VClaimConfig = defaultConfig;

  constructor(userConfig?: VClaimConfigInput) {
    this.userConfig = userConfig;
  }

  async invalidateConfig(): Promise<void> {
    this.configured = false;
    await this.applyConfig();
  }

  async getConfig(): Promise<VClaimConfig> {
    await this.applyConfig();
    return this.config;
  }

  async send<T, E = unknown>(type: VClaimType, option: SendOption): Promise<VClaimResponse<T, E>> {
    await this.applyConfig();
    const path = normalizePath(option.path);
    const baseUrl = this.config.baseUrls[type];
    if (!baseUrl) {
      throw new Error(`Invalid base URL for type "${type}"`);
    }

    let result = '';

    try {
      const url = new URL(baseUrl[this.config.mode] + path);
      const init: RequestInit = { method: option.method ?? 'GET' };
      const headers = { ...this.getDefaultHeaders(type), ...(option.headers ?? {}) };
      init.headers = headers;

      if (option.data) {
        if (option.method === 'GET') {
          throw new Error(`Can not pass data with "GET" method`);
        }
        init.body = JSON.stringify(option.data);
        if (!option.skipContentTypeHack) {
          init.headers = {
            ...headers,
            'Content-Type': 'Application/x-www-form-urlencoded'
          };
        }
      }

      this.onRequest?.({ ...option, type });
      const startedAt = performance.now();
      const response = await fetch(url, init);
      result = await response.text();
      if (!result) {
        throw new Error(`The response body is empty (${response.status})`);
      }

      const json = JSON.parse(result) as VClaimResponse<T, E>;
      if ((json as VClaimResponse<string, E>).response && !option.skipDecrypt) {
        const decrypted = this.decrypt(String((json as VClaimResponse<string, E>).response), headers['X-timestamp']);
        (json as VClaimResponse<T, E>).response = JSON.parse(this.decompress(decrypted)) as T;
      }

      const duration = performance.now() - startedAt;
      this.onResponse?.({ ...option, duration, type }, json as VClaimResponse<unknown, unknown>);
      return json as VClaimResponse<T, E>;
    } catch (error) {
      const customError = new Error(
        error instanceof SyntaxError
          ? `The response is not JSON (${parseHtml(result)})`
          : error instanceof Error
            ? error.message
            : JSON.stringify(error),
        { cause: error }
      );

      this.onError?.(customError);
      if (this.config.throw) {
        throw customError;
      }

      console.error(customError);
      const message = `An error occurred: "${customError.message}"`;
      return {
        metaData: { code: '500', message },
        response: undefined
      } as VClaimResponse<T, E>;
    }
  }

  private async applyConfig(): Promise<void> {
    if (this.configured) return;

    if (typeof this.userConfig === 'object') {
      this.config = this.mergeConfig(this.config, this.userConfig);
    } else if (typeof this.userConfig === 'function') {
      const userConfig = await this.userConfig();
      this.config = this.mergeConfig(this.config, userConfig);
    }

    if (!this.config.consId || !this.config.consSecret) {
      throw new Error('cons id and secret are not defined');
    }

    this.configured = true;
  }

  private mergeConfig(target: VClaimConfig, source: Partial<VClaimConfig>): VClaimConfig {
    const baseUrls = { ...target.baseUrls, ...source.baseUrls } as BaseUrls;
    return { ...target, ...source, baseUrls } as VClaimConfig;
  }

  private getDefaultHeaders(type: VClaimType): Record<string, string> {
    if (type !== 'vclaim') {
      throw new Error(`Unsupported type: ${type}`);
    }

    const { consId, consSecret, vclaimUserKey } = this.config;
    if (!vclaimUserKey) {
      throw new Error(`failed to get user key of type "${type}"`);
    }

    const timestamp = Math.round(Date.now() / 1000);
    const message = `${consId}&${timestamp}`;
    const signature = createHmac('SHA256', consSecret).update(message).digest('base64');

    return {
      'X-cons-id': consId,
      'X-timestamp': String(timestamp),
      'X-signature': encodeURI(signature),
      user_key: vclaimUserKey
    };
  }

  private decrypt(responseText: string, requestTimestamp: string): string {
    const { consId, consSecret } = this.config;
    const keyPlain = `${consId}${consSecret}${requestTimestamp}`;
    const key = createHash('sha256').update(keyPlain, 'utf8').digest();
    const iv = Uint8Array.from(key.subarray(0, 16));
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    let dec = decipher.update(responseText, 'base64', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }

  private decompress(text: string): string {
    return lz.decompressFromEncodedURIComponent(text);
  }
}

function parseHtml(html: string): string {
  if (!html) return '[empty]';
  return html
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .replace(/\r?\n+/g, ' - ')
    .replace(/\s+/g, ' ');
}

export function normalizePath(path: string | [string, Record<string, string | number | boolean | null | undefined>]): string {
  const [pathname, params] = typeof path === 'string' ? [path, undefined] : path;
  if (!pathname.startsWith('/')) throw new Error('Path must start with "/"');
  if (!params) return pathname;
  return pathname.replace(/\/:([A-Za-z0-9_]+)(\?)?/g, (_, key, optional) => {
    const value = params[key as keyof typeof params];
    if (value == null) {
      if (optional) return '';
      throw new Error(`Missing params: ${String(key)}`);
    }
    const component = String(value);
    try {
      return '/' + encodeURIComponent(decodeURIComponent(component));
    } catch {
      return '/' + encodeURIComponent(component);
    }
  });
}
