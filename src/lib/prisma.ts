import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const createAdapter = () => {
  if (process.env.DATABASE_URL) {
    return new PrismaPg({ connectionString: process.env.DATABASE_URL })
  }
  return undefined;
}

const prismaClientSingleton = () => {
  const adapter = createAdapter()
  return new PrismaClient(adapter ? { adapter } : undefined)
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
