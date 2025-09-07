// server/api/categories/index.get.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async () => {
  const categories = await prisma.categories.findMany({ orderBy: { name: 'asc' } })
  return sterilBigInt(categories)
})