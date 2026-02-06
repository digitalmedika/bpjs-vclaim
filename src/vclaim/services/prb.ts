import { VClaimBaseApi } from '../base.js';

export class PRB extends VClaimBaseApi {
  /**
   * Insert data rujuk balik
   */
  async insert(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Insert PRB',
      path: '/PRB/insert',
      method: 'POST',
      data: { request: { t_prb: data } }
    });
  }

  /**
   * Update data rujuk balik
   */
  async update(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Update PRB',
      path: '/PRB/Update',
      method: 'PUT',
      data: { request: { t_prb: data } }
    });
  }

  /**
   * Hapus data rujuk balik
   */
  async delete(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Hapus PRB',
      path: '/PRB/Delete',
      method: 'DELETE',
      data: { request: { t_prb: data } }
    });
  }

  /**
   * Pencarian data Rujuk Balik berdasarkan nomor SRB
   */
  async cariByNomor(params: { nomorSrb: string; nomorSep: string }) {
    return this.send({
      name: this.name + 'Cari by Nomor SRB',
      path: ['/prb/:nomorSrb/nosep/:nomorSep', params],
      method: 'GET'
    });
  }

  /**
   * Pencarian data Rujuk Balik berdasarkan tanggal SRB
   */
  async cariByTanggal(params: { awal: string; akhir: string }) {
    return this.send({
      name: this.name + 'Cari by Tanggal SRB',
      path: ['/prb/tglMulai/:awal/tglAkhir/:akhir', params],
      method: 'GET'
    });
  }

  /**
   * Menyediakan data rekap klaim yang diajukan oleh Faskes 2
   */
  async rekapPotensi(params: { tahun: string | number; bulan: string | number }) {
    return this.send({
      name: this.name + 'Rekap Potensi PRB',
      path: ['/prbpotensi/tahun/:tahun/bulan/:bulan', params],
      method: 'GET'
    });
  }
}
