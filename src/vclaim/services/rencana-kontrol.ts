import { VClaimBaseApi } from '../base.js';

const formPRBFieldsMap: Record<string, [string[], number, number]> = {
  HBA1C: [['01'], 0.1, 15],
  GDP: [['01', '07'], 10, 500],
  GD2JPP: [['01'], 10, 500],
  eGFR: [['01', '02'], 5, 150],
  TD_Sistolik: [['01', '07'], 20, 200],
  TD_Diastolik: [['01', '07'], 20, 200],
  LDL: [['01', '07'], 20, 500],
  Rata_TD_Sistolik: [['02', '04'], 20, 200],
  Rata_TD_Diastolik: [['02', '04'], 20, 200],
  JantungKoroner: [['02'], 0, 1],
  Stroke: [['02'], 0, 1],
  VaskularPerifer: [['02'], 0, 1],
  Aritmia: [['02', '04'], 0, 1],
  AtrialFibrilasi: [['02'], 0, 1],
  NadiIstirahat: [['04'], 20, 200],
  SesakNapas3Bulan: [['04'], 0, 1],
  NyeriDada3Bulan: [['04'], 0, 1],
  SesakNapasAktivitas: [['04'], 0, 1],
  NyeriDadaAktivitas: [['04'], 0, 1],
  Terkontrol: [['03'], 0, 1],
  Gejala2xMinggu: [['03'], 0, 1],
  BangunMalam: [['03'], 0, 1],
  KeterbatasanFisik: [['03'], 0, 1],
  FungsiParu: [['03'], 0, 100],
  SkorMMRC: [['05'], 0, 40],
  Eksaserbasi1Tahun: [['05'], 0, 1],
  MampuAktivitas: [['05'], 0, 1],
  Epileptik6Bulan: [['08'], 0, 1],
  EfekSampingOAB: [['08'], 0, 1],
  HamilMenyusui: [['08'], 0, 1],
  Remisi: [['06'], 0, 100],
  TerapiRumatan: [['06'], 0, 1],
  Usia: [['06'], 1, 100],
  AsamUrat: [['07'], 0.1, 20],
  RemisiSLE: [['09'], 0, 100],
  Hamil: [['09'], 0, 1]
};

export class RencanaKontrol extends VClaimBaseApi {
  get listPenyakitPRB() {
    return [
      ['01', 'Diabetes Mellitus'],
      ['02', 'Hipertensi'],
      ['03', 'Asma'],
      ['04', 'Penyakit Jantung'],
      ['05', 'PPOK'],
      ['06', 'Skizofrenia'],
      ['07', 'Stroke'],
      ['08', 'Epilepsi'],
      ['09', 'SLE']
    ].map(([kode, nama]) => ({ kode, nama }));
  }

  get allFieldsPenyakitPRB() {
    const fieldsMap = formPRBFieldsMap;
    return Object.entries(fieldsMap).map(([namaField, [listKode, nilaiMinimum, nilaiMaksimum]]) => ({
      namaField,
      listKode,
      nilaiMinimum,
      nilaiMaksimum
    }));
  }

  getFieldsPenyakitPRB(kode: string) {
    const fieldsMap = formPRBFieldsMap;
    return Object.entries(fieldsMap)
      .filter(([, [codes]]) => codes.includes(kode))
      .map(([namaField, [, nilaiMinimum, nilaiMaksimum]]) => ({
        namaField,
        nilaiMinimum,
        nilaiMaksimum
      }));
  }

  /**
   * Insert rencana kontrol
   */
  async insert(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Insert',
      path: '/RencanaKontrol/insert',
      method: 'POST',
      data: { request: data }
    });
  }

  /**
   * Insert rencana kontrol dengan API v2
   */
  async insertV2(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'InsertV2',
      path: '/RencanaKontrol/v2/Insert',
      method: 'POST',
      data: { request: data }
    });
  }

  /**
   * Update rencana kontrol
   */
  async update(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Update',
      path: '/RencanaKontrol/Update',
      method: 'PUT',
      data: { request: data }
    });
  }

  /**
   * Update rencana kontrol dengan API v2
   */
  async updateV2(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'UpdateV2',
      path: '/RencanaKontrol/v2/Update',
      method: 'PUT',
      data: { request: data }
    });
  }

  /**
   * Delete atau hapus rencana kontrol
   */
  async delete(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Hapus',
      path: '/RencanaKontrol/Delete',
      method: 'DELETE',
      data: { request: { t_suratkontrol: data } }
    });
  }

  /**
   * Insert surat pengantar rawat inap (SPRI)
   */
  async insertSPRI(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Insert SPRI',
      path: '/RencanaKontrol/InsertSPRI',
      method: 'POST',
      data: { request: data }
    });
  }

  /**
   * Update surat pengantar rawat inap (SPRI)
   */
  async updateSPRI(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Update SPRI',
      path: '/RencanaKontrol/UpdateSPRI',
      method: 'PUT',
      data: { request: data }
    });
  }

  /**
   * Melihat data SEP untuk keperluan rencana kontrol
   */
  async sep(params: { nomor: string }) {
    return this.send({
      name: this.name + 'Cari SEP',
      path: ['/RencanaKontrol/nosep/:nomor', params],
      method: 'GET'
    });
  }

  /**
   * Melihat detail surat kontrol berdasarkan nomor surat kontrol
   */
  async cari(params: { nomor: string }) {
    return this.send({
      name: this.name + 'Cari Surat Kontrol',
      path: ['/RencanaKontrol/noSuratKontrol/:nomor', params],
      method: 'GET'
    });
  }

  /**
   * List data rencana kontrol berdasarkan nomor kartu peserta
   */
  async dataByNoka(params: { bulan?: number; tahun: number; nomorKartu: string; filter: string | number }) {
    return this.send({
      name: this.name + 'Data Berdasarkan No. Kartu',
      path: [
        '/RencanaKontrol/ListRencanaKontrol/Bulan/:bulan/Tahun/:tahun/Nokartu/:nomorKartu/filter/:filter',
        { ...params, bulan: String(params.bulan || 1).padStart(2, '0') }
      ],
      method: 'GET'
    });
  }

  /**
   * List data rencana kontrol berdasarkan tanggal
   */
  async dataByTanggal(params: { awal: string; akhir: string; filter: string | number }) {
    return this.send({
      name: this.name + 'Data Berdasarkan Tanggal',
      path: [
        '/RencanaKontrol/ListRencanaKontrol/tglAwal/:awal/tglAkhir/:akhir/filter/:filter',
        params
      ],
      method: 'GET'
    });
  }

  /**
   * Data poli untuk rencana kontrol
   */
  async poli(params: { jenis: string | number; nomor: string; tanggal: string }) {
    return this.send({
      name: this.name + 'Data Poli/Spesialistik',
      path: [
        '/RencanaKontrol/ListSpesialistik/JnsKontrol/:jenis/nomor/:nomor/TglRencanaKontrol/:tanggal',
        params
      ],
      method: 'GET'
    });
  }

  /**
   * Data dokter untuk rencana kontrol
   */
  async dokter(params: { jenis: string | number; kodePoli: string; tanggal: string }) {
    return this.send({
      name: this.name + 'Data Dokter',
      path: [
        '/RencanaKontrol/JadwalPraktekDokter/JnsKontrol/:jenis/KdPoli/:kodePoli/TglRencanaKontrol/:tanggal',
        params
      ],
      method: 'GET'
    });
  }
}
