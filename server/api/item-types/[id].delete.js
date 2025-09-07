// server/api/item-types/[id].delete.js
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = BigInt(getRouterParam(event, 'id'))
  await prisma.item_types.delete({ where: { id } })
  return { message: 'Jenis barang berhasil dihapus' }
})