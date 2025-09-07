// server/api/brands/index.post.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async (event) => {
  const { name } = await readBody(event)
  const brand = await prisma.brands.create({ data: { name } })
  return sterilBigInt(brand)
})





