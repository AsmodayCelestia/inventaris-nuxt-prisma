// server/api/floors/index.post.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async (event) => {
  const { number, unit_id } = await readBody(event)
  const floor = await prisma.floors.create({ data: { number, unit_id: BigInt(unit_id) } })
  return sterilBigInt(floor)
})