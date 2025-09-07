// server/api/divisions/[id].delete.js
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = BigInt(getRouterParam(event, 'id'))
  await prisma.divisions.delete({ where: { id } })
  return { message: 'Divisi berhasil dihapus' }
})
