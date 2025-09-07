import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async () => {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      division_id: true,
      divisions: {          // <-- nama relasi yang benar
        select: { name: true }
      },
      is_room_supervisor: true,
      is_pj_maintenance: true
    },
    orderBy: { name: 'asc' }
  })

  /* flatten divisions → division */
  return sterilBigInt(
    users.map(u => ({
      ...u,
      division: u.divisions?.name ?? null,
      divisions: undefined
    }))
  )
})