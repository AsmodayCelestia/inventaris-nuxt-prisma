// server/api/floors/[id].delete.js
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = BigInt(getRouterParam(event, 'id'))
  await prisma.floors.delete({ where: { id } })
  return { message: 'Lantai berhasil dihapus' }
})