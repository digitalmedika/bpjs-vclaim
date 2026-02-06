import { VClaimBaseApi } from '../base.js';

export class Referensi extends VClaimBaseApi {
  /**
   * Pencarian data diagnosa (ICD-10)
   */
  async diagnosa(params: { keyword: string }) {
    return this.send({
      name: this.name + 'Diagnosa',
      path: ['/referensi/diagnosa/:keyword', params],
      method: 'GET'
    });
  }

  /**
   * Pencarian data poli
   */
  async poli(params: { keyword: string }) {
    return this.send({
      name: this.name + 'Poli',
      path: ['/referensi/poli/:keyword', params],
      method: 'GET'
    });
  }

  /**
   * Pencarian data fasilitas kesehatan
   */
  async faskes(params: { keyword: string; jenis: string | number }) {
    return this.send({
      name: this.name + 'Fasilitas Kesehatan',
      path: ['/referensi/faskes/:keyword/:jenis', params],
      method: 'GET'
    });
  }

  /**
   * Pencarian data dokter atau DPJP untuk pengisian DPJP Layan
   */
  async dpjp(params: { jenis: string | number; tanggal: string; kode: string }) {
    return this.send({
      name: this.name + 'DPJP',
      path: ['/referensi/dokter/pelayanan/:jenis/tglPelayanan/:tanggal/Spesialis/:kode', params],
      method: 'GET'
    });
  }

  /**
   * Daftar provinsi di Indonesia
   */
  async provinsi() {
    return this.send({
      name: this.name + 'Provinsi',
      path: '/referensi/propinsi',
      method: 'GET'
    });
  }

  /**
   * Daftar kabupaten di Indonesia berdasarkan kode provinsi
   */
  async kabupaten(params: { provinsi: string }) {
    return this.send({
      name: this.name + 'Kabupaten',
      path: ['/referensi/kabupaten/propinsi/:provinsi', params],
      method: 'GET'
    });
  }

  /**
   * Daftar kecamatan di Indonesia berdasarkan kode kabupaten
   */
  async kecamatan(params: { kabupaten: string }) {
    return this.send({
      name: this.name + 'Kecamatan',
      path: ['/referensi/kecamatan/kabupaten/:kabupaten', params],
      method: 'GET'
    });
  }

  /**
   * Daftar data diagnosa program PRB
   */
  async diagnosaPrb() {
    return this.send({
      name: this.name + 'Diagnosa PRB',
      path: '/referensi/diagnosaprb',
      method: 'GET'
    });
  }

  /**
   * Pencarian data obat generik PRB berdasarkan nama obat
   */
  async obatPrb(params: { nama: string }) {
    return this.send({
      name: this.name + 'Obat Generik PRB',
      path: ['/referensi/obatprb/:nama', params],
      method: 'GET'
    });
  }

  /**
   * Pencarian data prosedur atau tindakan (hanya untuk lembar pengajuan klaim)
   */
  async klaimProsedur(params: { keyword: string }) {
    return this.send({
      name: this.name + 'Prosedur (Pengajuan Klaim)',
      path: ['/referensi/procedure/:keyword', params],
      method: 'GET'
    });
  }

  /**
   * Daftar data kelas rawat (hanya untuk lembar pengajuan klaim)
   */
  async klaimKelasRawat() {
    return this.send({
      name: this.name + 'Kelas Rawat (Pengajuan Klaim)',
      path: '/referensi/kelasrawat',
      method: 'GET'
    });
  }

  /**
   * Pencarian data dokter berdasarkan nama (hanya untuk lembar pengajuan klaim)
   */
  async klaimDokter(params: { nama: string }) {
    return this.send({
      name: this.name + 'Dokter (Pengajuan Klaim)',
      path: ['/referensi/dokter/:nama', params],
      method: 'GET'
    });
  }

  /**
   * Daftar data spesialistik (hanya untuk lembar pengajuan klaim)
   */
  async klaimSpesialistik() {
    return this.send({
      name: this.name + 'Spesialistik (Pengajuan Klaim)',
      path: '/referensi/spesialistik',
      method: 'GET'
    });
  }

  /**
   * Daftar data ruang rawat (hanya untuk lembar pengajuan klaim)
   */
  async klaimRuangRawat() {
    return this.send({
      name: this.name + 'Ruang Rawat (Pengajuan Klaim)',
      path: '/referensi/ruangrawat',
      method: 'GET'
    });
  }

  /**
   * Daftar data cara keluar (hanya untuk lembar pengajuan klaim)
   */
  async klaimCaraKeluar() {
    return this.send({
      name: this.name + 'Cara Keluar (Pengajuan Klaim)',
      path: '/referensi/carakeluar',
      method: 'GET'
    });
  }

  /**
   * Daftar data paska pulang (hanya untuk lembar pengajuan klaim)
   */
  async klaimPaskaPulang() {
    return this.send({
      name: this.name + 'Paska Pulang (Pengajuan Klaim)',
      path: '/referensi/pascapulang',
      method: 'GET'
    });
  }
}
