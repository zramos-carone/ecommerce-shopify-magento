import { PrismaClient } from '@prisma/client'
import path from 'path'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// En Vercel, necesitamos resolver la ruta absoluta al archivo SQLite
// para que la función Lambda lo encuentre independientemente del contexto de ejecución.
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL || 'file:./prisma/dev.db';
  
  if (url.startsWith('file:') && process.env.NODE_ENV === 'production') {
    const sqlitePath = url.replace('file:', '');
    // Si la ruta es relativa, la unimos al CWD (raíz del proyecto en Vercel)
    const absolutePath = path.isAbsolute(sqlitePath) 
      ? sqlitePath 
      : path.join(process.cwd(), sqlitePath.startsWith('./') ? sqlitePath : `./${sqlitePath}`);
    
    console.log(`[PRISMA_DB_PATH]: Resolving SQLite path to: ${absolutePath}`);
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
  console.log('[PRISMA_CLIENT_INIT]: DATABASE_URL length: ' + (process.env.DATABASE_URL?.length || 0));
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
