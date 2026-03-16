import { describe, expect, it } from 'bun:test';
import type { SendOption } from '../src/core/types.js';
import { LPK } from '../src/vclaim/services/lpk.js';
import { Monitoring } from '../src/vclaim/services/monitoring.js';
import { Peserta } from '../src/vclaim/services/peserta.js';
import { PRB } from '../src/vclaim/services/prb.js';
import { Referensi } from '../src/vclaim/services/referensi.js';
import { RencanaKontrol } from '../src/vclaim/services/rencana-kontrol.js';
import { Rujukan } from '../src/vclaim/services/rujukan.js';
import { SEP } from '../src/vclaim/services/sep.js';

const createMockFetcher = () => {
  const calls: Array<{ type: string; option: SendOption }> = [];
  const fetcher = {
    calls,
    send: async (type: string, option: SendOption) => {
      calls.push({ type, option });
      return { metaData: { code: '200', message: 'OK' }, response: undefined };
    },
    getConfig: async () => ({})
  };

  return fetcher as any;
};

const expectSend = async (fetcher: any, call: Promise<unknown>, expected: SendOption) => {
  await call;
  expect(fetcher.calls.length).toBe(1);
  expect(fetcher.calls[0].type).toBe('vclaim');
  expect(fetcher.calls[0].option).toEqual(expected);
};

describe('LPK', () => {
  it('insert/update/delete/data', async () => {
    const fetcher = createMockFetcher();
    const api = new LPK(fetcher);

    await expectSend(fetcher, api.insert({ a: 1 }), {
      name: 'LPK -> Insert LPK',
      path: '/LPK/insert',
      method: 'POST',
      data: { request: { t_lpk: { a: 1 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.update({ b: 2 }), {
      name: 'LPK -> Update LPK',
      path: '/LPK/update',
      method: 'PUT',
      data: { request: { t_lpk: { b: 2 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.delete({ nomorSep: 'SEP01' }), {
      name: 'LPK -> Delete LPK',
      path: '/LPK/delete',
      method: 'DELETE',
      data: { request: { t_lpk: { noSep: 'SEP01' } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.data({ tanggal: '2026-02-05', jenis: 2 }), {
      name: 'LPK -> Data Pengajuan Lembar Klaim',
      path: '/LPK/TglMasuk/2026-02-05/JnsPelayanan/2',
      method: 'GET'
    });
  });
});

describe('Monitoring', () => {
  it('kunjungan/klaim/riwayat/klaimJasaRaharja', async () => {
    const fetcher = createMockFetcher();
    const api = new Monitoring(fetcher);

    await expectSend(fetcher, api.kunjungan({ tanggal: '2026-02-05', jenis: 2 }), {
      name: 'Monitoring -> Data Kunjungan',
      path: '/Monitoring/Kunjungan/Tanggal/2026-02-05/JnsPelayanan/2',
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.klaim({ tanggal: '2026-02-05', jenis: 2, status: 1 }), {
      name: 'Monitoring -> Data Klaim',
      path: '/Monitoring/Klaim/Tanggal/2026-02-05/JnsPelayanan/2/Status/1',
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(
      fetcher,
      api.riwayatPelayanan({ nomorKartu: '0001', awal: '2026-02-01', akhir: '2026-02-05' }),
      {
        name: 'Monitoring -> Data Histori Pelayanan Peserta',
        path: [
          '/monitoring/HistoriPelayanan/NoKartu/:nomorKartu/tglMulai/:awal/tglAkhir/:akhir',
          { nomorKartu: '0001', awal: '2026-02-01', akhir: '2026-02-05' }
        ],
        method: 'GET'
      }
    );

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.klaimJasaRaharja({ jenis: 2, awal: '2026-02-01', akhir: '2026-02-05' }), {
      name: 'Monitoring -> Data Klaim Jaminan Jasa Raharja',
      path: '/monitoring/JasaRaharja/JnsPelayanan/2/tglMulai/2026-02-01/tglAkhir/2026-02-05',
      method: 'GET'
    });
  });
});

describe('Peserta', () => {
  it('nomorKartu/nomorKependudukan', async () => {
    const fetcher = createMockFetcher();
    const api = new Peserta(fetcher);

    await expectSend(fetcher, api.nomorKartu({ nomor: '123', tanggal: '2026-02-05' }), {
      name: 'Peserta -> No. Kartu BPJS',
      path: ['/Peserta/nokartu/:nomor/tglSEP/:tanggal', { nomor: '123', tanggal: '2026-02-05' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.nomorKependudukan({ nomor: '321', tanggal: '2026-02-05' }), {
      name: 'Peserta -> NIK',
      path: ['/Peserta/nik/:nomor/tglSEP/:tanggal', { nomor: '321', tanggal: '2026-02-05' }],
      method: 'GET'
    });
  });
});

describe('PRB', () => {
  it('insert/update/delete/cari/rekap', async () => {
    const fetcher = createMockFetcher();
    const api = new PRB(fetcher);

    await expectSend(fetcher, api.insert({ a: 1 }), {
      name: 'PRB -> Insert PRB',
      path: '/PRB/insert',
      method: 'POST',
      data: { request: { t_prb: { a: 1 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.update({ b: 2 }), {
      name: 'PRB -> Update PRB',
      path: '/PRB/Update',
      method: 'PUT',
      data: { request: { t_prb: { b: 2 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.delete({ c: 3 }), {
      name: 'PRB -> Hapus PRB',
      path: '/PRB/Delete',
      method: 'DELETE',
      data: { request: { t_prb: { c: 3 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.cariByNomor({ nomorSrb: 'SRB', nomorSep: 'SEP' }), {
      name: 'PRB -> Cari by Nomor SRB',
      path: ['/prb/:nomorSrb/nosep/:nomorSep', { nomorSrb: 'SRB', nomorSep: 'SEP' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.cariByTanggal({ awal: '2026-02-01', akhir: '2026-02-05' }), {
      name: 'PRB -> Cari by Tanggal SRB',
      path: ['/prb/tglMulai/:awal/tglAkhir/:akhir', { awal: '2026-02-01', akhir: '2026-02-05' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.rekapPotensi({ tahun: 2026, bulan: 2 }), {
      name: 'PRB -> Rekap Potensi PRB',
      path: ['/prbpotensi/tahun/:tahun/bulan/:bulan', { tahun: 2026, bulan: 2 }],
      method: 'GET'
    });
  });
});

describe('Referensi', () => {
  it('all methods', async () => {
    const fetcher = createMockFetcher();
    const api = new Referensi(fetcher);

    await expectSend(fetcher, api.diagnosa({ keyword: 'A' }), {
      name: 'Referensi -> Diagnosa',
      path: ['/referensi/diagnosa/:keyword', { keyword: 'A' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.poli({ keyword: 'B' }), {
      name: 'Referensi -> Poli',
      path: ['/referensi/poli/:keyword', { keyword: 'B' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.faskes({ keyword: 'C', jenis: 1 }), {
      name: 'Referensi -> Fasilitas Kesehatan',
      path: ['/referensi/faskes/:keyword/:jenis', { keyword: 'C', jenis: 1 }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.dpjp({ jenis: 2, tanggal: '2026-02-05', kode: '001' }), {
      name: 'Referensi -> DPJP',
      path: ['/referensi/dokter/pelayanan/:jenis/tglPelayanan/:tanggal/Spesialis/:kode', { jenis: 2, tanggal: '2026-02-05', kode: '001' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.provinsi(), {
      name: 'Referensi -> Provinsi',
      path: '/referensi/propinsi',
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.kabupaten({ provinsi: '11' }), {
      name: 'Referensi -> Kabupaten',
      path: ['/referensi/kabupaten/propinsi/:provinsi', { provinsi: '11' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.kecamatan({ kabupaten: '1101' }), {
      name: 'Referensi -> Kecamatan',
      path: ['/referensi/kecamatan/kabupaten/:kabupaten', { kabupaten: '1101' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.diagnosaPrb(), {
      name: 'Referensi -> Diagnosa PRB',
      path: '/referensi/diagnosaprb',
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.obatPrb({ nama: 'Parasetamol' }), {
      name: 'Referensi -> Obat Generik PRB',
      path: ['/referensi/obatprb/:nama', { nama: 'Parasetamol' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.klaimProsedur({ keyword: 'PROC' }), {
      name: 'Referensi -> Prosedur (Pengajuan Klaim)',
      path: ['/referensi/procedure/:keyword', { keyword: 'PROC' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.klaimKelasRawat(), {
      name: 'Referensi -> Kelas Rawat (Pengajuan Klaim)',
      path: '/referensi/kelasrawat',
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.klaimDokter({ nama: 'DR' }), {
      name: 'Referensi -> Dokter (Pengajuan Klaim)',
      path: ['/referensi/dokter/:nama', { nama: 'DR' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.klaimSpesialistik(), {
      name: 'Referensi -> Spesialistik (Pengajuan Klaim)',
      path: '/referensi/spesialistik',
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.klaimRuangRawat(), {
      name: 'Referensi -> Ruang Rawat (Pengajuan Klaim)',
      path: '/referensi/ruangrawat',
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.klaimCaraKeluar(), {
      name: 'Referensi -> Cara Keluar (Pengajuan Klaim)',
      path: '/referensi/carakeluar',
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.klaimPaskaPulang(), {
      name: 'Referensi -> Paska Pulang (Pengajuan Klaim)',
      path: '/referensi/pascapulang',
      method: 'GET'
    });
  });

  it('mengambil referensi spesialis', async () => {
    const fetcher = createMockFetcher();
    const api = new Referensi(fetcher);

    await expectSend(fetcher, api.klaimSpesialistik(), {
      name: 'Referensi -> Spesialistik (Pengajuan Klaim)',
      path: '/referensi/spesialistik',
      method: 'GET'
    });
  });
});

describe('RencanaKontrol', () => {
  it('exposes PRB lists', () => {
    const api = new RencanaKontrol(createMockFetcher());
    const list = api.listPenyakitPRB;
    expect(list.length).toBe(9);
    expect(list[0]).toEqual({ kode: '01', nama: 'Diabetes Mellitus' });

    const fields = api.getFieldsPenyakitPRB('01');
    expect(fields.length).toBeGreaterThan(0);
    expect(fields[0].namaField).toBeDefined();

    const allFields = api.allFieldsPenyakitPRB;
    expect(allFields.length).toBeGreaterThan(0);
  });

  it('all methods', async () => {
    const fetcher = createMockFetcher();
    const api = new RencanaKontrol(fetcher);

    await expectSend(fetcher, api.insert({ a: 1 }), {
      name: 'RencanaKontrol -> Insert',
      path: '/RencanaKontrol/insert',
      method: 'POST',
      data: { request: { a: 1 } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.insertV2({ b: 2 }), {
      name: 'RencanaKontrol -> InsertV2',
      path: '/RencanaKontrol/v2/Insert',
      method: 'POST',
      data: { request: { b: 2 } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.update({ c: 3 }), {
      name: 'RencanaKontrol -> Update',
      path: '/RencanaKontrol/Update',
      method: 'PUT',
      data: { request: { c: 3 } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.updateV2({ d: 4 }), {
      name: 'RencanaKontrol -> UpdateV2',
      path: '/RencanaKontrol/v2/Update',
      method: 'PUT',
      data: { request: { d: 4 } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.delete({ e: 5 }), {
      name: 'RencanaKontrol -> Hapus',
      path: '/RencanaKontrol/Delete',
      method: 'DELETE',
      data: { request: { t_suratkontrol: { e: 5 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.insertSPRI({ f: 6 }), {
      name: 'RencanaKontrol -> Insert SPRI',
      path: '/RencanaKontrol/InsertSPRI',
      method: 'POST',
      data: { request: { f: 6 } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.updateSPRI({ g: 7 }), {
      name: 'RencanaKontrol -> Update SPRI',
      path: '/RencanaKontrol/UpdateSPRI',
      method: 'PUT',
      data: { request: { g: 7 } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.sep({ nomor: 'SEP' }), {
      name: 'RencanaKontrol -> Cari SEP',
      path: ['/RencanaKontrol/nosep/:nomor', { nomor: 'SEP' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.cari({ nomor: 'SK' }), {
      name: 'RencanaKontrol -> Cari Surat Kontrol',
      path: ['/RencanaKontrol/noSuratKontrol/:nomor', { nomor: 'SK' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.dataByNoka({ bulan: 2, tahun: 2026, nomorKartu: '0001', filter: 1 }), {
      name: 'RencanaKontrol -> Data Berdasarkan No. Kartu',
      path: [
        '/RencanaKontrol/ListRencanaKontrol/Bulan/:bulan/Tahun/:tahun/Nokartu/:nomorKartu/filter/:filter',
        { bulan: '02', tahun: 2026, nomorKartu: '0001', filter: 1 }
      ],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.dataByTanggal({ awal: '2026-02-01', akhir: '2026-02-05', filter: 1 }), {
      name: 'RencanaKontrol -> Data Berdasarkan Tanggal',
      path: [
        '/RencanaKontrol/ListRencanaKontrol/tglAwal/:awal/tglAkhir/:akhir/filter/:filter',
        { awal: '2026-02-01', akhir: '2026-02-05', filter: 1 }
      ],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.poli({ jenis: 1, nomor: 'SEP', tanggal: '2026-02-05' }), {
      name: 'RencanaKontrol -> Data Poli/Spesialistik',
      path: [
        '/RencanaKontrol/ListSpesialistik/JnsKontrol/:jenis/nomor/:nomor/TglRencanaKontrol/:tanggal',
        { jenis: 1, nomor: 'SEP', tanggal: '2026-02-05' }
      ],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.dokter({ jenis: 1, kodePoli: 'INT', tanggal: '2026-02-05' }), {
      name: 'RencanaKontrol -> Data Dokter',
      path: [
        '/RencanaKontrol/JadwalPraktekDokter/JnsKontrol/:jenis/KdPoli/:kodePoli/TglRencanaKontrol/:tanggal',
        { jenis: 1, kodePoli: 'INT', tanggal: '2026-02-05' }
      ],
      method: 'GET'
    });
  });
});

describe('Rujukan', () => {
  it('throws when sumber is invalid', async () => {
    const api = new Rujukan(createMockFetcher());
    await expect(api.cariByNomor({ sumber: 3 as 1 | 2, nomor: '123' })).rejects.toThrow(
      'Nilai sumber faskes harus 1 atau 2'
    );
  });

  it('all methods', async () => {
    const fetcher = createMockFetcher();
    const api = new Rujukan(fetcher);

    await expectSend(fetcher, api.cariByNomor({ sumber: 1, nomor: 'R1' }), {
      name: 'Rujukan -> Berdasarkan Nomor (1)',
      path: ['/Rujukan/:nomor', { sumber: 1, nomor: 'R1' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.cariByNoka({ sumber: 2, nomor: 'K1' }), {
      name: 'Rujukan -> Berdasarkan No. Kartu (2)',
      path: ['/Rujukan/RS/Peserta/:nomor', { sumber: 2, nomor: 'K1' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.cariByNokaMulti({ sumber: 1, nomor: 'K2' }), {
      name: 'Rujukan -> Berdasarkan No. Kartu (1) Multi',
      path: ['/Rujukan/List/Peserta/:nomor', { sumber: 1, nomor: 'K2' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.insert({ a: 1 }), {
      name: 'Rujukan -> Insert',
      path: '/Rujukan/insert',
      method: 'POST',
      data: { request: { t_rujukan: { a: 1 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.update({ b: 2 }), {
      name: 'Rujukan -> Update',
      path: '/Rujukan/update',
      method: 'PUT',
      data: { request: { t_rujukan: { b: 2 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.delete({ c: 3 }), {
      name: 'Rujukan -> Hapus',
      path: '/Rujukan/delete',
      method: 'DELETE',
      data: { request: { t_rujukan: { c: 3 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.insertKhusus({ d: 4 }), {
      name: 'Rujukan -> Insert Rujukan Khusus',
      path: '/Rujukan/Khusus/insert',
      method: 'POST',
      data: { d: 4 }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.deleteKhusus({ e: 5 }), {
      name: 'Rujukan -> Hapus Rujukan Khusus',
      path: '/Rujukan/Khusus/delete',
      method: 'POST',
      data: { request: { t_rujukan: { e: 5 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.listKhusus({ bulan: 2, tahun: 2026 }), {
      name: 'Rujukan -> List Rujukan Khusus',
      path: '/Rujukan/Khusus/List/Bulan/2/Tahun/2026',
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.insertV2({ f: 6 }), {
      name: 'Rujukan -> Insert V2',
      path: '/Rujukan/2.0/insert',
      method: 'POST',
      data: { request: { t_rujukan: { f: 6 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.updateV2({ g: 7 }), {
      name: 'Rujukan -> Update V2',
      path: '/Rujukan/2.0/Update',
      method: 'PUT',
      data: { request: { t_rujukan: { g: 7 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.listSpesialistik({ kodePpk: '001', tanggal: '2026-02-05' }), {
      name: 'Rujukan -> List Spesialistik Rujukan',
      path: ['/Rujukan/ListSpesialistik/PPKRujukan/:kodePpk/TglRujukan/:tanggal', { kodePpk: '001', tanggal: '2026-02-05' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.listSarana({ kodePpk: '001' }), {
      name: 'Rujukan -> List Sarana',
      path: ['/Rujukan/ListSarana/PPKRujukan/:kodePpk', { kodePpk: '001' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.listKeluar({ awal: '2026-02-01', akhir: '2026-02-05' }), {
      name: 'Rujukan -> List Rujukan Keluar Faskes',
      path: '/Rujukan/Keluar/List/tglMulai/2026-02-01/tglAkhir/2026-02-05',
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.keluarByNomor({ nomor: 'R001' }), {
      path: ['/Rujukan/Keluar/:nomor', { nomor: 'R001' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.jumlahSep({ jenis: 1, nomor: 'R001' }), {
      name: 'Rujukan -> List Rujukan Keluar Faskes Berdasarkan No. Rujukan',
      path: ['/Rujukan/JumlahSEP/:jenis/:nomor', { jenis: 1, nomor: 'R001' }],
      method: 'GET'
    });
  });
});

describe('SEP', () => {
  it('all methods', async () => {
    const fetcher = createMockFetcher();
    const api = new SEP(fetcher);

    await expectSend(fetcher, api.insert({ a: 1 }), {
      name: 'SEP -> Insert',
      path: '/SEP/1.1/insert',
      method: 'POST',
      data: { request: { t_sep: { a: 1 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.update({ b: 2 }), {
      name: 'SEP -> Update',
      path: '/SEP/1.1/Update',
      method: 'PUT',
      data: { request: { t_sep: { b: 2 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.delete({ c: 3 }), {
      path: '/SEP/Delete',
      method: 'DELETE',
      data: { request: { t_sep: { c: 3 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.cari({ nomor: 'SEP' }), {
      name: 'SEP -> Hapus',
      path: ['/SEP/:nomor', { nomor: 'SEP' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.cariByRujukan({ nomorRujukan: 'R01' }), {
      name: 'SEP -> Cari',
      path: ['/Rujukan/lastsep/norujukan/:nomorRujukan', { nomorRujukan: 'R01' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.insertV2({ d: 4 }), {
      name: 'SEP -> Insert V2',
      path: '/SEP/2.0/insert',
      method: 'POST',
      data: { request: { t_sep: { d: 4 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.updateV2({ e: 5 }), {
      name: 'SEP -> Update V2',
      path: '/SEP/2.0/update',
      method: 'PUT',
      data: { request: { t_sep: { e: 5 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.deleteV2({ f: 6 }), {
      name: 'SEP -> Hapus V2',
      path: '/SEP/2.0/delete',
      method: 'DELETE',
      skipDecrypt: true,
      data: { request: { t_sep: { f: 6 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.suplesiJasaRaharja({ nomorKartu: '0001', tanggalPelayanan: '2026-02-05' }), {
      name: 'SEP -> Suplesi Jasa Raharja',
      path: ['/sep/JasaRaharja/Suplesi/:nomorKartu/tglPelayanan/:tanggalPelayanan', { nomorKartu: '0001', tanggalPelayanan: '2026-02-05' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.dataIndukKecelakaan({ nomorKartu: '0001' }), {
      name: 'SEP -> Data Induk Kecelakaan',
      path: ['/sep/KllInduk/List/:nomorKartu', { nomorKartu: '0001' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.pengajuan({ g: 7 }), {
      name: 'SEP -> Pengajuan Penjamin',
      path: '/Sep/pengajuanSEP',
      method: 'POST',
      data: { request: { t_sep: { g: 7 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.approvalPengajuan({ h: 8 }), {
      name: 'SEP -> Approval Pengajuan',
      path: '/Sep/aprovalSEP',
      method: 'POST',
      data: { request: { t_sep: { h: 8 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.listPersetujuan({ bulan: 2, tahun: 2026 }), {
      name: 'SEP -> List Approval',
      path: '/Sep/persetujuanSEP/list/bulan/02/tahun/2026',
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.updateTanggalPulang({ i: 9 }), {
      name: 'SEP -> Update Tanggal Pulang',
      path: '/Sep/updtglplg',
      method: 'PUT',
      data: { request: { t_sep: { i: 9 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.updateTanggalPulangV2({ j: 10 }), {
      name: 'SEP -> Update Tanggal Pulang V2',
      path: '/SEP/2.0/updtglplg',
      method: 'PUT',
      data: { request: { t_sep: { j: 10 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.listTanggalPulang({ bulan: 2, tahun: 2026 }), {
      name: 'SEP -> List Update Tanggal Pulang',
      path: ['/Sep/updtglplg/list/bulan/:bulan/tahun/:tahun/:filter?', { bulan: '02', tahun: 2026 }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.inacbg({ nomor: 'SEP' }), {
      name: 'SEP -> INACBG',
      path: ['/sep/cbg/:nomor', { nomor: 'SEP' }],
      method: 'GET',
      skipDecrypt: true
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.listInternal({ nomor: 'SEP' }), {
      name: 'SEP -> List Internal',
      path: ['/SEP/Internal/:nomor', { nomor: 'SEP' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.deleteInternal({ k: 11 }), {
      name: 'SEP -> Hapus Internal',
      path: '/SEP/Internal/delete',
      method: 'DELETE',
      data: { request: { t_sep: { k: 11 } } }
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.fingerPrint({ nomorKartu: '0001', tanggal: '2026-02-05' }), {
      name: 'SEP -> Status Fingerprint',
      path: ['/SEP/FingerPrint/Peserta/:nomorKartu/TglPelayanan/:tanggal', { nomorKartu: '0001', tanggal: '2026-02-05' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.listFingerPrint({ tanggal: '2026-02-05' }), {
      name: 'SEP -> List Fingerprint',
      path: ['/SEP/FingerPrint/List/Peserta/TglPelayanan/:tanggal', { tanggal: '2026-02-05' }],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.listRandomQuestions({ nomorKartu: '0001', tanggal: '2026-02-05' }), {
      name: 'SEP -> List Random Question',
      path: [
        '/SEP/FingerPrint/randomquestion/faskesterdaftar/nokapst/:nomorKartu/tglsep/:tanggal',
        { nomorKartu: '0001', tanggal: '2026-02-05' }
      ],
      method: 'GET'
    });

    fetcher.calls.length = 0;
    await expectSend(fetcher, api.sendRandomQuestionAnswers({ l: 12 }), {
      name: 'SEP -> Post Random Question',
      path: '/SEP/FingerPrint/randomanswer',
      method: 'POST',
      data: { request: { t_sep: { l: 12 } } }
    });
  });
});
