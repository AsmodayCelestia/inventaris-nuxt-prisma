// server/api/units/index.post.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { name } = await readBody(event)

  const exists = await prisma.location_units.findFirst({ where: { name } })
  if (exists) throw createError({ statusCode: 409, statusMessage: 'Nama unit sudah ada' })

  const created = await prisma.location_units.create({ data: { name } })
  return sterilBigInt(created)
})