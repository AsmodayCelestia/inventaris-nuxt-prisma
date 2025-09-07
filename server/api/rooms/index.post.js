import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async (event) => {
  const id = BigInt(getRouterParam(event, 'id'))
  const { name, floor_id, pj_lokasi_id } = await readBody(event)

  const duplicate = await prisma.rooms.findFirst({
    where: { floor_id: BigInt(floor_id), name, NOT: { id } }
  })
  if (duplicate) throw createError({ statusCode: 409, statusMessage: 'Nama ruangan sudah ada di lantai ini' })

  const room = await prisma.rooms.update({
    where: { id },
    data: {
      name,
      floor_id: BigInt(floor_id),
      pj_lokasi_id: pj_lokasi_id ? BigInt(pj_lokasi_id) : null
    }
  })

  return sterilBigInt(room)
})