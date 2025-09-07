// server/api/item-types/index.get.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async () => {
  const types = await prisma.item_types.findMany({ orderBy: { name: 'asc' } })
  return sterilBigInt(types)
})