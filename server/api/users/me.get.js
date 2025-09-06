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
      division: {
        select: {
          name: true,
          isPjMaintenance: true
        }
      },
      isRoomSupervisor: true,
      assignedRooms: {
        select: {
          room_id: true
        }
      }
    }
  })
  if (!user) throw createError({ statusCode: 401, statusMessage: 'User not found' })

  // flatten & cast assignedRooms jadi array of Number saja
  const flat = {
    ...user,
    division: user.division.name,
    isPjMaintenance: user.division.isPjMaintenance,
    assignedRooms: user.assignedRooms.map(r => Number(r.room_id))
  }
  delete flat.division_id

  return sterilBigInt(flat)
})