import { CachedApi } from '../core/cache.js';
import type { VClaimFetcher } from '../core/fetcher.js';
import { LPK } from './services/lpk.js';
import { Monitoring } from './services/monitoring.js';
import { Peserta } from './services/peserta.js';
import { PRB } from './services/prb.js';
import { Referensi } from './services/referensi.js';
import { RencanaKontrol } from './services/rencana-kontrol.js';
import { Rujukan } from './services/rujukan.js';
import { SEP } from './services/sep.js';

export class VClaim {
  private readonly cache: CachedApi;
  private readonly fetcher: VClaimFetcher;

  constructor(cache: CachedApi, fetcher: VClaimFetcher) {
    this.cache = cache;
    this.fetcher = fetcher;
  }

  get lpk() {
    return this.cache.get('vclaim_lpk', LPK, this.fetcher);
  }

  get monitoring() {
    return this.cache.get('vclaim_monitoring', Monitoring, this.fetcher);
  }

  get peserta() {
    return this.cache.get('vclaim_peserta', Peserta, this.fetcher);
  }

  get prb() {
    return this.cache.get('vclaim_prb', PRB, this.fetcher);
  }

  get referensi() {
    return this.cache.get('vclaim_referensi', Referensi, this.fetcher);
  }

  get rencanaKontrol() {
    return this.cache.get('vclaim_rencanaKontrol', RencanaKontrol, this.fetcher);
  }

  get rujukan() {
    return this.cache.get('vclaim_rujukan', Rujukan, this.fetcher);
  }

  get sep() {
    return this.cache.get('vclaim_sep', SEP, this.fetcher);
  }
}
