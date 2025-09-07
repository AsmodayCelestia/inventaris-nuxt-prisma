// server/api/units/[id].put.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const id = BigInt(getRouterParam(event, 'id'))
  const { name } = await readBody(event)

  const exists = await prisma.location_units.findFirst({
    where: { name, NOT: { id } }
  })
  if (exists) throw createError({ statusCode: 409, statusMessage: 'Nama unit sudah ada' })

  const updated = await prisma.location_units.update({ where: { id }, data: { name } })
  return sterilBigInt(updated)
})