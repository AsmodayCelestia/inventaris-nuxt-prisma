import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async () => {
  const rooms = await prisma.rooms.findMany({
    include: {
      floors: {
        include: {
          location_units: { select: { id: true, name: true } }
        }
      },
      users: { select: { id: true, name: true } }  // ← bukan pj_lokasi
    },
    orderBy: { name: 'asc' }
  })

  // alias supaya frontend tetap pakai nama lama
return sterilBigInt(
  rooms.map(({ floors, users, ...rest }) => ({
    ...rest,
    floor: {
      id: floors.id,
      number: floors.number,
      unit: floors.location_units
    },
    locationPersonInCharge: users
  }))
)
})