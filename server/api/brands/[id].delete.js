// server/api/brands/[id].delete.js
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = BigInt(getRouterParam(event, 'id'))
  await prisma.brands.delete({ where: { id } })
  return { message: 'Merk berhasil dihapus' }
})