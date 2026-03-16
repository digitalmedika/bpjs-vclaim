# bpjs-vclaim

Wrapper VClaim BPJS (standalone, tanpa `@ssecd/jkn`).

## Setup

1. Install dependencies

```bash
bun install
```

2. Buat file `.env` berdasarkan `.env.example`

```bash
cp .env.example .env
```

3. Isi konfigurasi di `.env`

```env
NODE_ENV=development
JKN_PPK_CODE=
JKN_CONS_ID=
JKN_CONS_SECRET=
JKN_VCLAIM_USER_KEY=
```

## Contoh penggunaan

```ts
import { VClaimClient } from './index.js';

const vclaim = new VClaimClient({
  consId: process.env.JKN_CONS_ID ?? '',
  consSecret: process.env.JKN_CONS_SECRET ?? '',
  vclaimUserKey: process.env.JKN_VCLAIM_USER_KEY ?? '',
  ppkCode: process.env.JKN_PPK_CODE ?? '',
  mode: 'development'
});

const res = await vclaim.peserta.nomorKartu({
  nomor: '0001234567890',
  tanggal: '2026-02-05'
});

console.log(res.metaData, res.response);
```

## API (VClaim Services)

Akses semua service lewat instance client:

```ts
const vclaim = new VClaimClient();

vclaim.lpk
vclaim.monitoring
vclaim.peserta
vclaim.prb
vclaim.referensi
vclaim.rencanaKontrol
vclaim.rujukan
vclaim.sep
```

### LPK

- `insert(data)`
- `update(data)`
- `delete({ nomorSep })`
- `data({ tanggal, jenis })`

### Monitoring

- `kunjungan({ tanggal, jenis })`
- `klaim({ tanggal, jenis, status })`
- `riwayatPelayanan({ nomorKartu, awal, akhir })`
- `klaimJasaRaharja({ jenis, awal, akhir })`

### Peserta

- `nomorKartu({ nomor, tanggal })`
- `nomorKependudukan({ nomor, tanggal })`

### PRB

- `insert(data)`
- `update(data)`
- `delete(data)`
- `cariByNomor({ nomorSrb, nomorSep })`
- `cariByTanggal({ awal, akhir })`
- `rekapPotensi({ tahun, bulan })`

### Referensi

- `diagnosa({ keyword })`
- `poli({ keyword })`
- `faskes({ keyword, jenis })`
- `dpjp({ jenis, tanggal, kode })`
- `provinsi()`
- `kabupaten({ provinsi })`
- `kecamatan({ kabupaten })`
- `diagnosaPrb()`
- `obatPrb({ nama })`
- `klaimProsedur({ keyword })`
- `klaimKelasRawat()`
- `klaimDokter({ nama })`
- `klaimSpesialistik()`
- `klaimRuangRawat()`
- `klaimCaraKeluar()`
- `klaimPaskaPulang()`

### Rencana Kontrol

- `insert(data)`
- `insertV2(data)`
- `update(data)`
- `updateV2(data)`
- `delete(data)`
- `insertSPRI(data)`
- `updateSPRI(data)`
- `sep({ nomor })`
- `cari({ nomor })`
- `dataByNoka({ bulan?, tahun, nomorKartu, filter })`
- `dataByTanggal({ awal, akhir, filter })`
- `poli({ jenis, nomor, tanggal })`
- `dokter({ jenis, kodePoli, tanggal })`
- `listPenyakitPRB`
- `allFieldsPenyakitPRB`
- `getFieldsPenyakitPRB(kode)`

### Rujukan

- `cariByNomor({ sumber, nomor })`
- `cariByNoka({ sumber, nomor })`
- `cariByNokaMulti({ sumber, nomor })`
- `insert(data)`
- `update(data)`
- `delete(data)`
- `insertKhusus(data)`
- `deleteKhusus(data)`
- `listKhusus({ bulan, tahun })`
- `insertV2(data)`
- `updateV2(data)`
- `listSpesialistik({ kodePpk, tanggal })`
- `listSarana({ kodePpk })`
- `listKeluar({ awal, akhir })`
- `keluarByNomor({ nomor })`
- `jumlahSep({ jenis, nomor })`

### SEP

- `insert(data)` (deprecated)
- `update(data)` (deprecated)
- `delete(data)` (deprecated)
- `cari({ nomor })`
- `cariByRujukan({ nomorRujukan })`
- `insertV2(data)`
- `updateV2(data)`
- `deleteV2(data)`
- `suplesiJasaRaharja({ nomorKartu, tanggalPelayanan })`
- `dataIndukKecelakaan({ nomorKartu })`
- `pengajuan(data)`
- `approvalPengajuan(data)`
- `listPersetujuan({ bulan?, tahun })`
- `updateTanggalPulang(data)` (deprecated)
- `updateTanggalPulangV2(data)`
- `listTanggalPulang({ bulan?, tahun, filter? })`
- `inacbg({ nomor })`
- `listInternal({ nomor })`
- `deleteInternal(data)`
- `fingerPrint({ nomorKartu, tanggal })`
- `listFingerPrint({ tanggal })`
- `listRandomQuestions({ nomorKartu, tanggal })`
- `sendRandomQuestionAnswers(data)`
