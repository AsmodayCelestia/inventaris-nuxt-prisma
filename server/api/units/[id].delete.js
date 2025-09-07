// server/api/units/[id].delete.js
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = BigInt(getRouterParam(event, 'id'))
  await prisma.location_units.delete({ where: { id } })
  return { message: 'Unit berhasil dihapus' }
})