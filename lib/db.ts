import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV === 'production') {
  console.log('[PRISMA_CLIENT_INIT]: Database initialized in production.');
  console.log('[PRISMA_CLIENT_INIT]: DATABASE_URL is ' + (process.env.DATABASE_URL ? 'PRESENT' : 'MISSING'));
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
