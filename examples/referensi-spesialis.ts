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

vclaim.onRequest = async (info) => {
  console.log('Request:', JSON.stringify(info, null, 2));
};

vclaim.onResponse = async (_info, result) => {
  console.log('Response:', JSON.stringify(result, null, 2));
};

vclaim.onError = async (error) => {
  console.error('Error:', error.message);
};

const result = await vclaim.referensi.klaimSpesialistik();

if (Array.isArray(result.response)) {
  console.log('\nDaftar referensi spesialis:');
  console.table(
    result.response.map((item: Record<string, unknown>) => ({
      kode: String(item.kode ?? item.kdSpesialis ?? item.kdSpesialistik ?? ''),
      nama: String(item.nama ?? item.nmSpesialis ?? item.nmSpesialistik ?? '')
    }))
  );
}

console.log(JSON.stringify(result, null, 2));
