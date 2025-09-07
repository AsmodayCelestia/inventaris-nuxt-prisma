// server/api/brands/[id].put.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async (event) => {
  const id = BigInt(getRouterParam(event, 'id'))
  const { name } = await readBody(event)
  const brand = await prisma.brands.update({ where: { id }, data: { name } })
  return sterilBigInt(brand)
})