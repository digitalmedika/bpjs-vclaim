import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { normalizePath, VClaimFetcher } from '../src/core/fetcher.js';

const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = originalFetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('normalizePath', () => {
  it('replaces params and keeps static path', () => {
    const path = normalizePath(['/Peserta/nokartu/:nomor/tglSEP/:tanggal', { nomor: '123', tanggal: '2026-02-05' }]);
    expect(path).toBe('/Peserta/nokartu/123/tglSEP/2026-02-05');
  });

  it('removes optional params when not provided', () => {
    const path = normalizePath(['/Sep/updtglplg/list/bulan/:bulan/tahun/:tahun/:filter?', { bulan: '01', tahun: '2026' }]);
    expect(path).toBe('/Sep/updtglplg/list/bulan/01/tahun/2026');
  });

  it('throws on missing required params', () => {
    expect(() => normalizePath(['/Peserta/nokartu/:nomor/tglSEP/:tanggal', { nomor: '123' }])).toThrow(
      'Missing params: tanggal'
    );
  });
});

describe('VClaimFetcher', () => {
  it('returns parsed response when skipDecrypt is true', async () => {
    let calledUrl = '';
    globalThis.fetch = (async (input: RequestInfo, init?: RequestInit) => {
      calledUrl = typeof input === 'string' ? input : input.url;
      expect(init?.method).toBe('GET');
      return new Response(
        JSON.stringify({
          metaData: { code: '200', message: 'OK' },
          response: { ok: true }
        })
      );
    }) as typeof fetch;

    const fetcher = new VClaimFetcher({
      consId: 'cons',
      consSecret: 'secret',
      vclaimUserKey: 'userkey',
      mode: 'development'
    });

    const result = await fetcher.send('vclaim', {
      path: '/test',
      method: 'GET',
      skipDecrypt: true
    });

    expect(calledUrl).toBe('https://apijkn-dev.bpjs-kesehatan.go.id/vclaim-rest-dev/test');
    expect(result.metaData.code).toBe('200');
    expect(result.response).toEqual({ ok: true });
  });

  it('throws when cons id/secret are missing', async () => {
    const fetcher = new VClaimFetcher({
      vclaimUserKey: 'userkey',
      mode: 'development'
    });

    await expect(
      fetcher.send('vclaim', {
        path: '/test',
        method: 'GET',
        skipDecrypt: true
      })
    ).rejects.toThrow('cons id and secret are not defined');
  });
});
