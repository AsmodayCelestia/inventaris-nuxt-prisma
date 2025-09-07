// server/api/floors/[id].put.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async (event) => {
  const id = BigInt(getRouterParam(event, 'id'))
  const { number, unit_id } = await readBody(event)
  const floor = await prisma.floors.update({
    where: { id },
    data: { number, unit_id: BigInt(unit_id) }
  })
  return sterilBigInt(floor)
})