// server/api/divisions/[id].get.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async (event) => {
  const id = BigInt(getRouterParam(event, 'id'))
  const division = await prisma.divisions.findUnique({ where: { id } })
  if (!division) throw createError({ statusCode: 404, statusMessage: 'Divisi tidak ditemukan' })
  return sterilBigInt(division)
})