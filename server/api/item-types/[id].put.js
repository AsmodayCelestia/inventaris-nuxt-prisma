// server/api/item-types/[id].put.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const id = BigInt(getRouterParam(event, 'id'))
  const { name } = await readBody(event)

  const exists = await prisma.item_types.findFirst({
    where: { name, NOT: { id } }
  })
  if (exists) throw createError({ statusCode: 409, statusMessage: 'Nama jenis sudah ada' })

  const updated = await prisma.item_types.update({ where: { id }, data: { name } })
  return sterilBigInt(updated)
})