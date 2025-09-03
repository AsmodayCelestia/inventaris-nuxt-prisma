// server/middleware/auth.js
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // 1. Abaikan semua route non-API
  if (!event.path.startsWith('/api')) return

  // 2. Abaikan route API yang memang boleh publik
  const publicPaths = ['/api/auth/login', '/api/inventories/qr']
  if (publicPaths.some(p => event.path.startsWith(p))) return

  // 3. Baru cek token
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  try {
    jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})