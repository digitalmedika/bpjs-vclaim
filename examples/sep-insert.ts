import { VClaimClient } from '../src/index.js';

const getRequiredEnv = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Environment variable ${name} wajib diisi`);
  }
  return value;
};

const env = {
  consId: getRequiredEnv('JKN_CONS_ID'),
  consSecret: getRequiredEnv('JKN_CONS_SECRET'),
  vclaimUserKey: getRequiredEnv('JKN_VCLAIM_USER_KEY'),
  ppkCode: getRequiredEnv('JKN_PPK_CODE'),
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production'
} as const;

const getOptionalEnv = (name: string, fallback: string) => {
  return process.env[name]?.trim() || fallback;
};

const vclaim = new VClaimClient(env);

vclaim.onRequest = async (info) => {
  console.log('Request:', JSON.stringify(info, null, 2));
};

vclaim.onResponse = async (_info, result) => {
  console.log('Response:', JSON.stringify(result, null, 2));
};

vclaim.onError = async (error) => {
  console.error('Error:', error.message);
};

const sepPayload = {
  noKartu: '0002039387275',
  // Tanggal pelayanan SEP. Jangan pakai tanggal masa depan.
  tglSep: getOptionalEnv('SEP_TGL', '2026-05-13'),
  ppkPelayanan: env.ppkCode,
  // IGD umumnya rawat jalan.
  jnsPelayanan: '2',
  klsRawat: {
    // Hak kelas peserta, contoh umum: 3
    klsRawatHak: '1',
    klsRawatNaik: '',
    pembiayaan: '',
    penanggungJawab: ''
  },
  noMR: '000013',
  rujukan: {
    // asalRujukan wajib diisi '1' (Faskes Tk I) atau '2' (Faskes Tk II/RS), tidak boleh string kosong
    asalRujukan: '2',
    tglRujukan: '',
    noRujukan: '',
    // ppkRujukan harus diisi kode faskes, jika tidak ada bisa pakai kode faskes sendiri (env.ppkCode) atau 00000000
    ppkRujukan: env.ppkCode
  },
  catatan: 'Testing insert SEP IGD via API',
  // Contoh: A09
  diagAwal: 'J90',
  poli: {
    // Ganti dengan kode poli BPJS yang valid untuk pelayanan ini.
    tujuan: getOptionalEnv('SEP_KODE_POLI', 'IGD'),
    eksekutif: '0'
  },
  cob: {
    cob: '0'
  },
  katarak: {
    katarak: '0'
  },
  jaminan: {
    lakaLantas: '0',
    noLP: '',
    penjamin: {
      tglKejadian: '',
      keterangan: '',
      suplesi: {
        suplesi: '0',
        noSepSuplesi: '',
        lokasiLaka: {
          kdPropinsi: '',
          kdKabupaten: '',
          kdKecamatan: ''
        }
      }
    }
  },
  // Untuk IGD biasanya kunjungan normal.
  tujuanKunj: '0',
  flagProcedure: '',
  kdPenunjang: '',
  // Assesment pelayanan, kosongkan (\"\") jika tujuanKunj = '0' (Normal)
  assesmentPel: '',
  skdp: {
    noSurat: '',
    kodeDPJP: ''
  },
  // Ambil dari hasil examples/referensi-dpjp.ts.
  dpjpLayan: getOptionalEnv('SEP_DPJP_LAYAN', '305556'),
  noTelp: '081234567890',
  user: 'tester'
};

const result = await vclaim.sep.insertV2(sepPayload);

console.log(JSON.stringify(result, null, 2));
