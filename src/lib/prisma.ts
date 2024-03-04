import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma ?? new PrismaClient()
/**
 * This is because Next hot reload
 * - Prevent to create multiple instances
 * - global is excluded from hot reload
 */
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
