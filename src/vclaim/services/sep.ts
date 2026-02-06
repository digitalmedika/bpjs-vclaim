import { VClaimBaseApi } from '../base.js';

export class SEP extends VClaimBaseApi {
  /**
   * Buat SEP
   * @deprecated Gunakan insertV2
   */
  async insert(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Insert',
      path: '/SEP/1.1/insert',
      method: 'POST',
      data: { request: { t_sep: data } }
    });
  }

  /**
   * Update SEP
   * @deprecated Gunakan updateV2
   */
  async update(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Update',
      path: '/SEP/1.1/Update',
      method: 'PUT',
      data: { request: { t_sep: data } }
    });
  }

  /**
   * Hapus SEP
   * @deprecated Gunakan deleteV2
   */
  async delete(data: Record<string, unknown>) {
    return this.send({
      path: '/SEP/Delete',
      method: 'DELETE',
      data: { request: { t_sep: data } }
    });
  }

  /**
   * Detail data SEP berdasarkan nomor SEP
   */
  async cari(params: { nomor: string }) {
    return this.send({
      name: this.name + 'Hapus',
      path: ['/SEP/:nomor', params],
      method: 'GET'
    });
  }

  /**
   * Detail data SEP terakhir berdasarkan nomor rujukan
   */
  async cariByRujukan(params: { nomorRujukan: string }) {
    return this.send({
      name: this.name + 'Cari',
      path: ['/Rujukan/lastsep/norujukan/:nomorRujukan', params],
      method: 'GET'
    });
  }

  /**
   * Insert SEP V2.0
   */
  async insertV2(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Insert V2',
      path: '/SEP/2.0/insert',
      method: 'POST',
      data: { request: { t_sep: data } }
    });
  }

  /**
   * Update SEP V2.0
   */
  async updateV2(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Update V2',
      path: '/SEP/2.0/update',
      method: 'PUT',
      data: { request: { t_sep: data } }
    });
  }

  /**
   * Hapus SEP V2.0
   */
  async deleteV2(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Hapus V2',
      path: '/SEP/2.0/delete',
      method: 'DELETE',
      skipDecrypt: true,
      data: { request: { t_sep: data } }
    });
  }

  /**
   * Pencarian data potensi SEP sebagai Suplesi Jasa Raharja
   */
  async suplesiJasaRaharja(params: { nomorKartu: string; tanggalPelayanan: string }) {
    return this.send({
      name: this.name + 'Suplesi Jasa Raharja',
      path: ['/sep/JasaRaharja/Suplesi/:nomorKartu/tglPelayanan/:tanggalPelayanan', params],
      method: 'GET'
    });
  }

  /**
   * Pencarian data SEP Induk Kecelakaan Lalu Lintas
   */
  async dataIndukKecelakaan(params: { nomorKartu: string }) {
    return this.send({
      name: this.name + 'Data Induk Kecelakaan',
      path: ['/sep/KllInduk/List/:nomorKartu', params],
      method: 'GET'
    });
  }

  /**
   * Pengajuan SEP
   */
  async pengajuan(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Pengajuan Penjamin',
      path: '/Sep/pengajuanSEP',
      method: 'POST',
      data: { request: { t_sep: data } }
    });
  }

  /**
   * Approval pengajuan SEP
   */
  async approvalPengajuan(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Approval Pengajuan',
      path: '/Sep/aprovalSEP',
      method: 'POST',
      data: { request: { t_sep: data } }
    });
  }

  /**
   * Data persetujuan SEP
   */
  async listPersetujuan(params: { bulan?: number; tahun: number }) {
    const bulan = String(params.bulan || 0).padStart(2, '0');
    return this.send({
      name: this.name + 'List Approval',
      path: `/Sep/persetujuanSEP/list/bulan/${bulan}/tahun/${params.tahun}`,
      method: 'GET'
    });
  }

  /**
   * Update tanggal pulang SEP
   * @deprecated Gunakan updateTanggalPulangV2
   */
  async updateTanggalPulang(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Update Tanggal Pulang',
      path: '/Sep/updtglplg',
      method: 'PUT',
      data: { request: { t_sep: data } }
    });
  }

  /**
   * Update tanggal pulang V2.0
   */
  async updateTanggalPulangV2(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Update Tanggal Pulang V2',
      path: '/SEP/2.0/updtglplg',
      method: 'PUT',
      data: { request: { t_sep: data } }
    });
  }

  /**
   * Data update tanggal pulang
   */
  async listTanggalPulang(params: { bulan?: number; tahun: number; filter?: string | number }) {
    return this.send({
      name: this.name + 'List Update Tanggal Pulang',
      path: [
        '/Sep/updtglplg/list/bulan/:bulan/tahun/:tahun/:filter?',
        { ...params, bulan: String(params.bulan || 1).padStart(2, '0') }
      ],
      method: 'GET'
    });
  }

  /**
   * Pencarian nomor SEP untuk aplikasi Inacbg 4.1
   */
  async inacbg(params: { nomor: string }) {
    return this.send({
      name: this.name + 'INACBG',
      path: ['/sep/cbg/:nomor', params],
      method: 'GET',
      skipDecrypt: true
    });
  }

  /**
   * Data SEP internal
   */
  async listInternal(params: { nomor: string }) {
    return this.send({
      name: this.name + 'List Internal',
      path: ['/SEP/Internal/:nomor', params],
      method: 'GET'
    });
  }

  /**
   * Hapus SEP internal
   */
  async deleteInternal(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Hapus Internal',
      path: '/SEP/Internal/delete',
      method: 'DELETE',
      data: { request: { t_sep: data } }
    });
  }

  /**
   * Status fingerprint pasien per tanggal pelayanan
   */
  async fingerPrint(params: { nomorKartu: string; tanggal: string }) {
    return this.send({
      name: this.name + 'Status Fingerprint',
      path: ['/SEP/FingerPrint/Peserta/:nomorKartu/TglPelayanan/:tanggal', params],
      method: 'GET'
    });
  }

  /**
   * Data peserta fingerprint
   */
  async listFingerPrint(params: { tanggal: string }) {
    return this.send({
      name: this.name + 'List Fingerprint',
      path: ['/SEP/FingerPrint/List/Peserta/TglPelayanan/:tanggal', params],
      method: 'GET'
    });
  }

  /**
   * Data random questions
   */
  async listRandomQuestions(params: { nomorKartu: string; tanggal: string }) {
    return this.send({
      name: this.name + 'List Random Question',
      path: [
        '/SEP/FingerPrint/randomquestion/faskesterdaftar/nokapst/:nomorKartu/tglsep/:tanggal',
        params
      ],
      method: 'GET'
    });
  }

  /**
   * Kirim jawaban dari random questions
   */
  async sendRandomQuestionAnswers(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Post Random Question',
      path: '/SEP/FingerPrint/randomanswer',
      method: 'POST',
      data: { request: { t_sep: data } }
    });
  }
}
