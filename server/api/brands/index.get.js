// server/api/brands/index.get.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async () => {
  const brands = await prisma.brands.findMany({ orderBy: { name: 'asc' } })
  return sterilBigInt(brands)
})