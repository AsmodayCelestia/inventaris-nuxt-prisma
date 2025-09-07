import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = BigInt(getRouterParam(event, 'id'))
  await prisma.rooms.delete({ where: { id } })
  return { message: 'Ruangan berhasil dihapus' }
})