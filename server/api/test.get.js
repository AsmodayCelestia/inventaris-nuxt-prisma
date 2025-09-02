import { prisma } from '../utils/prisma.js'

export default defineEventHandler(async () => {
  return await prisma.user.findMany()
})