// server/middleware/auth.js
export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV === 'dev') return   // lepas di dev
  // ...validasi token kalau prod
})