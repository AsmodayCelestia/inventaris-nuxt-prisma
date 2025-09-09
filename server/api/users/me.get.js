// server/api/users/me.get.js
import { createError, getCookie } from 'h3'
import { prisma } from '~~/server/utils/prisma.js'
import { sterilBigInt } from '~~/server/utils/serialize.js'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // 1. ambil token dari cookie
  const token = getCookie(event, 'auth-token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  // 2. verify & extract payload (contoh pakai JWT)
  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  const userId = Number(payload.id)
  if (!Number.isFinite(userId)) throw createError({ statusCode: 401 })

  // 3. query user sama seperti sebelumnya
  const user = await prisma.users.findUnique({
    where: { id: BigInt(userId) },
    select: {
      id: true, name: true, email: true, role: true, division_id: true,
      divisions: { select: { name: true } },
      is_room_supervisor: true, is_pj_maintenance: true,
    },
  })
  if (!user) throw createError({ statusCode: 401 })

  return sterilBigInt({
    ...user,
    division: user.divisions?.name ?? null,
    isPjMaintenance: user.is_pj_maintenance,
    isRoomSupervisor: user.is_room_supervisor,
    assignedRooms: [], // nanti diisi
  })
})