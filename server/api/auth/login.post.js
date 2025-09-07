// server/api/auth/login.post.js
import { setCookie } from 'h3' // <-- PASTIKAN diimport
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '~~/server/utils/prisma.js'
import { sterilBigInt } from '~~/server/utils/serialize.js'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const user = await prisma.users.findUnique({ where: { email } })

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { id: String(user.id), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  setCookie(event, 'auth-token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production', // true hanya di prod
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/'
  })

  // return terakhir
  return { user: sterilBigInt(user) }
})