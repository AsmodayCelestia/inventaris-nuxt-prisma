// server/api/divisions/index.get.js
import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'

export default defineEventHandler(async () => {
  const divisions = await prisma.divisions.findMany({ orderBy: { name: 'asc' } })
  return sterilBigInt(divisions)
})