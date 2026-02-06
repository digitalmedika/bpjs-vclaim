import { VClaimBaseApi } from '../base.js';

export class Rujukan extends VClaimBaseApi {
  private validateSumber(params: { sumber: 1 | 2 }) {
    if (![1, 2].includes(params.sumber)) {
      throw new Error('Nilai sumber faskes harus 1 atau 2');
    }
  }

  /**
   * Pencarian data rujukan berdasarkan nomor rujukan
   */
  async cariByNomor(params: { sumber: 1 | 2; nomor: string }) {
    this.validateSumber(params);
    const paths = {
      1: '/Rujukan/:nomor',
      2: '/Rujukan/RS/:nomor'
    } as const;

    return this.send({
      name: this.name + `Berdasarkan Nomor (${params.sumber})`,
      path: [paths[params.sumber], params],
      method: 'GET'
    });
  }

  /**
   * Pencarian data rujukan berdasarkan nomor kartu peserta
   */
  async cariByNoka(params: { sumber: 1 | 2; nomor: string }) {
    this.validateSumber(params);
    const paths = {
      1: '/Rujukan/Peserta/:nomor',
      2: '/Rujukan/RS/Peserta/:nomor'
    } as const;

    return this.send({
      name: this.name + `Berdasarkan No. Kartu (${params.sumber})`,
      path: [paths[params.sumber], params],
      method: 'GET'
    });
  }

  /**
   * Pencarian data rujukan berdasarkan nomor kartu peserta (Multi records)
   */
  async cariByNokaMulti(params: { sumber: 1 | 2; nomor: string }) {
    this.validateSumber(params);
    const paths = {
      1: '/Rujukan/List/Peserta/:nomor',
      2: '/Rujukan/RS/List/Peserta/:nomor'
    } as const;

    return this.send({
      name: this.name + `Berdasarkan No. Kartu (${params.sumber}) Multi`,
      path: [paths[params.sumber], params],
      method: 'GET'
    });
  }

  /**
   * Insert rujukan
   */
  async insert(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Insert',
      path: '/Rujukan/insert',
      method: 'POST',
      data: { request: { t_rujukan: data } }
    });
  }

  /**
   * Update data rujukan
   */
  async update(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Update',
      path: '/Rujukan/update',
      method: 'PUT',
      data: { request: { t_rujukan: data } }
    });
  }

  /**
   * Hapus data rujukan
   */
  async delete(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Hapus',
      path: '/Rujukan/delete',
      method: 'DELETE',
      data: { request: { t_rujukan: data } }
    });
  }

  /**
   * Insert rujukan khusus
   */
  async insertKhusus(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Insert Rujukan Khusus',
      path: '/Rujukan/Khusus/insert',
      method: 'POST',
      data
    });
  }

  /**
   * Delete atau hapus rujukan khusus
   */
  async deleteKhusus(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Hapus Rujukan Khusus',
      path: '/Rujukan/Khusus/delete',
      method: 'POST',
      data: { request: { t_rujukan: data } }
    });
  }

  /**
   * List data rujukan khusus
   */
  async listKhusus(params: { bulan: string | number; tahun: string | number }) {
    return this.send({
      name: this.name + 'List Rujukan Khusus',
      path: `/Rujukan/Khusus/List/Bulan/${params.bulan}/Tahun/${params.tahun}`,
      method: 'GET'
    });
  }

  /**
   * Insert rujukan menggunakan versi 2.0
   */
  async insertV2(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Insert V2',
      path: '/Rujukan/2.0/insert',
      method: 'POST',
      data: { request: { t_rujukan: data } }
    });
  }

  /**
   * Update data rujukan menggunakan versi 2.0
   */
  async updateV2(data: Record<string, unknown>) {
    return this.send({
      name: this.name + 'Update V2',
      path: '/Rujukan/2.0/Update',
      method: 'PUT',
      data: { request: { t_rujukan: data } }
    });
  }

  /**
   * Data spesialistik rujukan
   */
  async listSpesialistik(params: { kodePpk: string; tanggal: string }) {
    return this.send({
      name: this.name + 'List Spesialistik Rujukan',
      path: ['/Rujukan/ListSpesialistik/PPKRujukan/:kodePpk/TglRujukan/:tanggal', params],
      method: 'GET'
    });
  }

  /**
   * Data sarana rujukan
   */
  async listSarana(params: { kodePpk: string }) {
    return this.send({
      name: this.name + 'List Sarana',
      path: ['/Rujukan/ListSarana/PPKRujukan/:kodePpk', params],
      method: 'GET'
    });
  }

  /**
   * Data rujukan keluar rumah sakit atau klinik utama
   */
  async listKeluar(params: { awal: string; akhir: string }) {
    return this.send({
      name: this.name + 'List Rujukan Keluar Faskes',
      path: `/Rujukan/Keluar/List/tglMulai/${params.awal}/tglAkhir/${params.akhir}`,
      method: 'GET'
    });
  }

  /**
   * Detail rujukan keluar rumah sakit atau klinik utama berdasarkan nomor rujukan
   */
  async keluarByNomor(params: { nomor: string }) {
    return this.send({
      path: ['/Rujukan/Keluar/:nomor', params],
      method: 'GET'
    });
  }

  /**
   * Jumlah SEP yang terbentuk berdasarkan nomor rujukan
   */
  async jumlahSep(params: { jenis: string | number; nomor: string }) {
    return this.send({
      name: this.name + 'List Rujukan Keluar Faskes Berdasarkan No. Rujukan',
      path: ['/Rujukan/JumlahSEP/:jenis/:nomor', params],
      method: 'GET'
    });
  }
}
