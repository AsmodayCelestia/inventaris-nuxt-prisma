// server/api/categories/[id].put.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async (event) => {
  const id = BigInt(getRouterParam(event, 'id'))
  const { name } = await readBody(event)
  const category = await prisma.categories.update({ where: { id }, data: { name } })
  return sterilBigInt(category)
})