import { VClaimBaseApi } from '../base.js';

export class LPK extends VClaimBaseApi {
  /**
   * Insert Rujukan
   */
  async insert(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Insert LPK',
      path: '/LPK/insert',
      method: 'POST',
      data: { request: { t_lpk: data } }
    });
  }

  /**
   * Update Rujukan
   */
  async update(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Update LPK',
      path: '/LPK/update',
      method: 'PUT',
      data: { request: { t_lpk: data } }
    });
  }

  /**
   * Delete Rujukan
   */
  async delete(params: { nomorSep: string }) {
    return this.send({
      name: this.name + 'Delete LPK',
      path: '/LPK/delete',
      method: 'DELETE',
      data: { request: { t_lpk: { noSep: params.nomorSep } } }
    });
  }

  /**
   * Data lembar pengajuan klaim berdasarkan tanggal masuk dan jenis pelayanan
   */
  async data(params: { tanggal: string; jenis: string | number }) {
    return this.send({
      name: this.name + 'Data Pengajuan Lembar Klaim',
      path: `/LPK/TglMasuk/${params.tanggal}/JnsPelayanan/${params.jenis}`,
      method: 'GET'
    });
  }
}
