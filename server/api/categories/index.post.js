// server/api/categories/index.post.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async (event) => {
  const { name } = await readBody(event)
  const category = await prisma.categories.create({ data: { name } })
  return sterilBigInt(category)
})