import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async () => {
  const floors = await prisma.floors.findMany({
    include: { location_units: { select: { id: true, name: true } } },
    orderBy: { number: 'asc' }
  })
  return sterilBigInt(floors)
})