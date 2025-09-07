// server/api/divisions/index.post.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async (event) => {
  const { name } = await readBody(event)
  const division = await prisma.divisions.create({ data: { name } })
  return sterilBigInt(division)
})