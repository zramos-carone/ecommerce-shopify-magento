import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

/**
 * [VERCEL_SQLITE_FIX]: Forzar el rastreo de archivos (NFT).
 * Referenciamos físicamente el archivo para que Vercel lo incluya en el bundle.
 */
const DB_RELATIVE_PATH = './prisma/dev.db';
const _dbFile = path.resolve(process.cwd(), DB_RELATIVE_PATH);

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL || `file:${DB_RELATIVE_PATH}`;
  
  if (url.startsWith('file:') && process.env.NODE_ENV === 'production') {
    const sqlitePath = url.replace('file:', '');
    const absolutePath = path.isAbsolute(sqlitePath) 
      ? sqlitePath 
      : path.join(process.cwd(), sqlitePath.startsWith('./') ? sqlitePath : `./${sqlitePath}`);
    
    // LOGS DE DEPURACIÓN ETIQUETADOS (A petición del usuario)
    console.log(`[PRISMA_DB_TRACE]: File referenced at: ${_dbFile}`);
    console.log(`[PRISMA_DB_PATH]: Calculated absolute path: ${absolutePath}`);
    
    if (fs.existsSync(absolutePath)) {
      console.log('[PRISMA_DB_STATUS]: ✅ Database file FOUND on disk.');
    } else {
      console.error(`[PRISMA_DB_STATUS]: ❌ Database file NOT FOUND at ${absolutePath}`);
      // Listar archivos en /prisma para debug
      try {
        const prismaDir = path.join(process.cwd(), 'prisma');
        if (fs.existsSync(prismaDir)) {
          console.log(`[PRISMA_DB_DEBUG]: Files in /prisma: ${fs.readdirSync(prismaDir).join(', ')}`);
        } else {
          console.log('[PRISMA_DB_DEBUG]: /prisma directory does not exist.');
        }
      } catch (e) {
        console.error('[PRISMA_DB_DEBUG]: Failed to list directory.', e);
      }
    }
    
    return `file:${absolutePath}`;
  }
  
  return url;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV === 'production') {
  console.log('[PRISMA_CLIENT_INIT]: Database initialized in production.');
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
