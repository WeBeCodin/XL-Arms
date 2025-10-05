import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    RSR_USE_KV: process.env.RSR_USE_KV,
    RSR_USE_KV_VALUE: process.env.RSR_USE_KV === 'true',
    allRSRVars: {
      RSR_FTP_HOST: !!process.env.RSR_FTP_HOST,
      RSR_FTP_PORT: process.env.RSR_FTP_PORT,
      RSR_FTP_USER: !!process.env.RSR_FTP_USER,
      RSR_FTP_PASSWORD: !!process.env.RSR_FTP_PASSWORD,
      RSR_FTP_SECURE: process.env.RSR_FTP_SECURE,
      RSR_INVENTORY_PATH: !!process.env.RSR_INVENTORY_PATH,
      RSR_USE_KV: process.env.RSR_USE_KV,
      RSR_SYNC_ENABLED: process.env.RSR_SYNC_ENABLED,
      RSR_MAX_RECORDS: process.env.RSR_MAX_RECORDS,
      RSR_BATCH_SIZE: process.env.RSR_BATCH_SIZE,
    },
    kvEnvVars: {
      KV_REST_API_URL: !!process.env.KV_REST_API_URL,
      KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
      KV_REST_API_READ_ONLY_TOKEN: !!process.env.KV_REST_API_READ_ONLY_TOKEN,
      KV_URL: !!process.env.KV_URL,
    },
    postgresEnvVars: {
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
    }
  });
}
