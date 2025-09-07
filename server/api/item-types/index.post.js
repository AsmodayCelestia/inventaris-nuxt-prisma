// server/api/item-types/index.post.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { name } = await readBody(event)

  const exists = await prisma.item_types.findFirst({ where: { name } })
  if (exists) throw createError({ statusCode: 409, statusMessage: 'Nama jenis sudah ada' })

  const created = await prisma.item_types.create({ data: { name } })
  return sterilBigInt(created)
})