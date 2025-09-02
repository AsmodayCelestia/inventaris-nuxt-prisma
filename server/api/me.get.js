// server/api/me.get.js
import { PrismaClient } from '../utils/prisma.js'
const prisma = PrismaClient()

export default defineEventHandler(async () => {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
    include: { division: true }
  })
  return user || { message: 'User belum ada' }
})