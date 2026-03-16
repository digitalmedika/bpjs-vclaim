import { VClaimClient } from '../src/index.js';

const getRequiredEnv = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Environment variable ${name} wajib diisi`);
  }
  return value;
};

const vclaim = new VClaimClient({
  consId: getRequiredEnv('JKN_CONS_ID'),
  consSecret: getRequiredEnv('JKN_CONS_SECRET'),
  vclaimUserKey: getRequiredEnv('JKN_VCLAIM_USER_KEY'),
  ppkCode: getRequiredEnv('JKN_PPK_CODE'),
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production'
});

const getOptionalEnv = (name: string, fallback: string) => {
  return process.env[name]?.trim() || fallback;
};

vclaim.onRequest = async (info) => {
  console.log('Request:', JSON.stringify(info, null, 2));
};

vclaim.onResponse = async (_info, result) => {
  console.log('Response:', JSON.stringify(result, null, 2));
};

const dpjpParams = {
  // 1 rawat inap, 2 rawat jalan
  jenis: getOptionalEnv('SEP_JNS_PELAYANAN', '2'),
  // Samakan dengan tanggal SEP yang akan dibuat.
  tanggal: getOptionalEnv('SEP_TGL', '2026-03-16'),
  // Isi dengan kode spesialis/poli BPJS yang valid, mis. IGD/INT/ANA.
  kode: getOptionalEnv('SEP_KODE_SPESIALIS', 'INT')
};

const result = await vclaim.referensi.dpjp(dpjpParams);

if (Array.isArray(result.response)) {
  console.log('\nDaftar DPJP yang bisa dipakai untuk dpjpLayan:');
  console.table(
    result.response.map((item: Record<string, unknown>) => ({
      kode: String(item.kode ?? item.kdDPJP ?? item.kodedokter ?? ''),
      nama: String(item.nama ?? item.nmDPJP ?? item.namadokter ?? ''),
      spesialis: String(item.spesialis ?? item.nmSpesialis ?? '')
    }))
  );
}

console.log(JSON.stringify(result, null, 2));
