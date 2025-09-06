// server/middleware/auth.js
import { defineEventHandler, createError, getCookie } from 'h3'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // 1. skip non-API & OPTIONS pre-flight
  if (event.method === 'OPTIONS' || !event.path.startsWith('/api')) return

  // 2. whitelist publik
  const publicPaths = ['/api/auth/login', '/api/inventories/qr', '/api/_nuxt_icon']
  if (publicPaths.some(p => event.path.startsWith(p))) return

  // 3. ambil & verifikasi token
  const token = getCookie(event, 'auth-token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    event.context.auth = payload   // siap pakai di handler
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})