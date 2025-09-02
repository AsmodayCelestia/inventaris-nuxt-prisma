// server/api/seed.post.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../utils/prisma.js'

export default defineEventHandler(async (event) => {
  const hashed = await bcrypt.hash('123456', 10)

  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: hashed,
      role: 'admin'
    }
  })

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )
  console.log('Generated token:', token)

  return { user, token }
})