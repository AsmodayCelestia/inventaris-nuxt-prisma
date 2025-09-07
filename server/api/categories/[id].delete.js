// server/api/categories/[id].delete.js
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = BigInt(getRouterParam(event, 'id'))
  await prisma.categories.delete({ where: { id } })
  return { message: 'Kategori berhasil dihapus' }
})