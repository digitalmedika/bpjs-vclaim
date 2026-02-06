import type { SendOption, VClaimConfig, VClaimResponse, VClaimType } from './types.js';
import type { VClaimFetcher } from './fetcher.js';

export abstract class BaseApi {
  protected abstract type: VClaimType;
  protected readonly fetcher: VClaimFetcher;

  constructor(fetcher: VClaimFetcher) {
    this.fetcher = fetcher;
  }

  send<T, E = unknown>(option: SendOption): Promise<VClaimResponse<T, E>> {
    return this.fetcher.send<T, E>(this.type, option);
  }

  async getConfig(): Promise<VClaimConfig> {
    return this.fetcher.getConfig();
  }

  async requiredConfig(...keys: (keyof VClaimConfig)[]): Promise<VClaimConfig> {
    const config = await this.getConfig();
    for (const key of keys) {
      if (!config[key]) {
        const message = `The "${String(key)}" config value must not be falsy for this request`;
        throw new Error(message);
      }
    }
    return config;
  }

  get name(): string {
    return this.constructor.name + ' -> ';
  }
}
