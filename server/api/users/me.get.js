// server/api/users/me.get.js
import { createError } from 'h3'
import { prisma } from '~~/server/utils/prisma.js'
import { sterilBigInt } from '~~/server/utils/serialize.js'

export default defineEventHandler(async (event) => {
  const { auth } = event.context
  const userId = Number(auth.id)
  if (!Number.isFinite(userId)) throw createError({ statusCode: 401, statusMessage: 'Malformed id' })

  const user = await prisma.users.findUnique({
    where: { id: BigInt(userId) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      division_id: true,
      divisions: {
        select: {
          name: true // hanya nama
        }
      },
      is_room_supervisor: true,
      is_pj_maintenance: true // <-- ini yang benar
    }
  })
  if (!user) throw createError({ statusCode: 401, statusMessage: 'User not found' })

  // flatten
  return sterilBigInt({
    ...user,
    division: user.divisions?.name ?? null,
    isPjMaintenance: user.is_pj_maintenance,
    isRoomSupervisor: user.is_room_supervisor,
    assignedRooms: [] // belum ada relasi user_rooms
  })
})