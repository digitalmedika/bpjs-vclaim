import { VClaimBaseApi } from '../base.js';

export class Monitoring extends VClaimBaseApi {
  /**
   * Pencarian data kunjungan
   */
  async kunjungan(params: { tanggal: string; jenis: string | number }) {
    return this.send({
      name: this.name + 'Data Kunjungan',
      path: `/Monitoring/Kunjungan/Tanggal/${params.tanggal}/JnsPelayanan/${params.jenis}`,
      method: 'GET'
    });
  }

  /**
   * Pencarian data klaim
   */
  async klaim(params: { tanggal: string; jenis: string | number; status: string | number }) {
    return this.send({
      name: this.name + 'Data Klaim',
      path: `/Monitoring/Klaim/Tanggal/${params.tanggal}/JnsPelayanan/${params.jenis}/Status/${params.status}`,
      method: 'GET'
    });
  }

  /**
   * Pencarian history atau riwayat pelayanan per peserta
   */
  async riwayatPelayanan(params: {
    nomorKartu: string;
    awal: string;
    akhir: string;
  }) {
    return this.send({
      name: this.name + 'Data Histori Pelayanan Peserta',
      path: [
        '/monitoring/HistoriPelayanan/NoKartu/:nomorKartu/tglMulai/:awal/tglAkhir/:akhir',
        params
      ],
      method: 'GET'
    });
  }

  /**
   * Monitoring data klaim jaminan Jasa Raharja
   */
  async klaimJasaRaharja(params: { jenis: string | number; awal: string; akhir: string }) {
    return this.send({
      name: this.name + 'Data Klaim Jaminan Jasa Raharja',
      path: `/monitoring/JasaRaharja/JnsPelayanan/${params.jenis}/tglMulai/${params.awal}/tglAkhir/${params.akhir}`,
      method: 'GET'
    });
  }
}
