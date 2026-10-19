import { VClaimClient } from '../src/index.js';

const getRequiredEnv = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Environment variable ${name} wajib diisi`);
  }
  return value;
};

const getOptionalEnv = (name: string, fallback: string) => {
  return process.env[name]?.trim() || fallback;
};

const env = {
  consId: getRequiredEnv('JKN_CONS_ID'),
  consSecret: getRequiredEnv('JKN_CONS_SECRET'),
  vclaimUserKey: getRequiredEnv('JKN_VCLAIM_USER_KEY'),
  ppkCode: getRequiredEnv('JKN_PPK_CODE'),
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production'
} as const;

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

const pengajuanPayload = {
  noKartu: getOptionalEnv('SEP_NO_KARTU', '0002039387275'),
  tglSep: getOptionalEnv('SEP_TGL_RENCANA', '2026-05-22'),
  jnsPelayanan: getOptionalEnv('SEP_JNS_PELAYANAN', '2'), // 1 = Rawat Inap, 2 = Rawat Jalan
  jnsPengajuan: getOptionalEnv('SEP_JNS_PENGAJUAN', '1'), // 1 = Backdate
  keterangan: getOptionalEnv('SEP_KETERANGAN', 'Pengajuan persetujuan SEP backdate'),
  user: getOptionalEnv('SEP_USER', 'tester')
};

const result = await vclaim.sep.pengajuan(pengajuanPayload);

console.log(JSON.stringify(result, null, 2));
