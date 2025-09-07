import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  await prisma.users.delete({ where: { id: BigInt(id) } })  // <-- BigInt
  return { message: 'User berhasil dihapus' }
})