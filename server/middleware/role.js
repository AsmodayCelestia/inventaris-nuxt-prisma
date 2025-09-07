// server/middleware/role.js
import { createError } from 'h3'

/**
 * Daftar PREFIX yang HARUS memiliki salah satu role tertentu.
 * Semua path di bawah ini melewati auth.js (sudah login) DAN dicek role-nya.
 * Path yang tidak disebut = cukup login (karyawan) boleh akses.
 */
const protectedMap = [
  // ---------- ADMIN ONLY ----------
  { prefix: '/api/register',        roles: ['admin'] },
  { prefix: '/api/activity-log',    roles: ['admin'] },
  { prefix: '/api/reports',         roles: ['admin'] },          // semua /api/reports/...
  { prefix: '/api/qrcodes/bulk',    roles: ['admin'] },
  { prefix: '/api/units',           roles: ['admin'] },          // POST/PUT/DELETE unit
  { prefix: '/api/divisions',       roles: ['admin'] },          // full CUD divisions

  // ---------- ADMIN & HEAD ----------
  { prefix: '/api/users',           roles: ['admin', 'head'] },  // full CRUD user
  // master data (kecuali GET) – jika Anda ingin lebih presisi, pisahkan per-method;
  // untuk sekarang kita asumsikan seluruh resource di bawah ini butuh admin/head
  { prefix: '/api/brands',          roles: ['admin', 'head'] },
  { prefix: '/api/categories',      roles: ['admin', 'head'] },
  { prefix: '/api/item-types',      roles: ['admin', 'head'] },
  { prefix: '/api/floors',          roles: ['admin', 'head'] },
  { prefix: '/api/rooms',           roles: ['admin', 'head'] },
  { prefix: '/api/inventory-items', roles: ['admin', 'head'] },
  { prefix: '/api/inventories',     roles: ['admin', 'head'] },  // full CUD inventaris
  { prefix: '/api/maintenance',     roles: ['admin', 'head'] },  // full CUD maintenance
]

export default defineEventHandler(async (event) => {
  if (event.method === 'OPTIONS') return                // lewatkan pre-flight
  const rule = protectedMap.find(r => event.path.startsWith(r.prefix))
  if (!rule) return                                     // tidak terproteksi role → lewatkan

  const { auth } = event.context
  if (!auth) throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  if (!rule.roles.includes(auth.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: `Forbidden. Required role: ${rule.roles.join(' | ')}`
    })
  }
})