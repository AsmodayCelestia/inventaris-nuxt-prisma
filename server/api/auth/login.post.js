export default defineEventHandler(async (event) => {
  // skip auth untuk seed
  if (getRequestURL(event).pathname === '/api/seed') return

  const token = getHeader(event, 'authorization')?.split(' ')[1]
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'No token' })
  }

})