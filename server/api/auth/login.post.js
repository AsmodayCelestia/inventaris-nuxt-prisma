import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../utils/prisma.js'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const user = await prisma.users.findUnique({ where: { email } })
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { id: String(user.id), role: user.role }, // BigInt → String
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )
  return { token }
})