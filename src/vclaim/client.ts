import { CachedApi } from '../core/cache.js';
import { VClaimFetcher } from '../core/fetcher.js';
import type { VClaimConfigInput } from '../core/types.js';
import { VClaim } from './vclaim.js';

export class VClaimClient {
  private readonly fetcher: VClaimFetcher;
  private readonly cache = new CachedApi();
  private readonly vclaimApi: VClaim;

  constructor(config?: VClaimConfigInput) {
    this.fetcher = new VClaimFetcher(config);
    this.vclaimApi = new VClaim(this.cache, this.fetcher);
  }

  get services() {
    return this.vclaimApi;
  }

  get lpk() {
    return this.vclaimApi.lpk;
  }

  get monitoring() {
    return this.vclaimApi.monitoring;
  }

  get peserta() {
    return this.vclaimApi.peserta;
  }

  get prb() {
    return this.vclaimApi.prb;
  }

  get referensi() {
    return this.vclaimApi.referensi;
  }

  get rencanaKontrol() {
    return this.vclaimApi.rencanaKontrol;
  }

  get rujukan() {
    return this.vclaimApi.rujukan;
  }

  get sep() {
    return this.vclaimApi.sep;
  }

  async invalidateConfig(): Promise<void> {
    this.cache.clear();
    await this.fetcher.invalidateConfig();
  }

  async getConfig() {
    return this.fetcher.getConfig();
  }

  set onRequest(handler: VClaimFetcher['onRequest']) {
    this.fetcher.onRequest = handler;
  }

  get onRequest(): VClaimFetcher['onRequest'] {
    return this.fetcher.onRequest;
  }

  set onResponse(handler: VClaimFetcher['onResponse']) {
    this.fetcher.onResponse = handler;
  }

  get onResponse(): VClaimFetcher['onResponse'] {
    return this.fetcher.onResponse;
  }

  set onError(handler: VClaimFetcher['onError']) {
    this.fetcher.onError = handler;
  }

  get onError(): VClaimFetcher['onError'] {
    return this.fetcher.onError;
  }
}

export function createVClaimClient(config?: VClaimConfigInput): VClaimClient {
  return new VClaimClient(config);
}
