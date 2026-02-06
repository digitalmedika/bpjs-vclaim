import { VClaimBaseApi } from '../base.js';

export class Peserta extends VClaimBaseApi {
  /**
   * Pencarian data peserta berdasarkan nomor kartu
   */
  async nomorKartu(params: { nomor: string; tanggal: string }) {
    return this.send({
      name: this.name + 'No. Kartu BPJS',
      path: ['/Peserta/nokartu/:nomor/tglSEP/:tanggal', params],
      method: 'GET'
    });
  }

  /**
   * Pencarian data peserta berdasarkan NIK
   */
  async nomorKependudukan(params: { nomor: string; tanggal: string }) {
    return this.send({
      name: this.name + 'NIK',
      path: ['/Peserta/nik/:nomor/tglSEP/:tanggal', params],
      method: 'GET'
    });
  }
}
