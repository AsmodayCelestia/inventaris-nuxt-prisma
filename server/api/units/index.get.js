// server/api/units/index.get.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async () => {
  const units = await prisma.location_units.findMany({ orderBy: { name: 'asc' } })
  return sterilBigInt(units)
})