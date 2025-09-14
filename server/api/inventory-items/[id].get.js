import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' })

  const item = await prisma.inventoryItem.findUnique({
    where: { id },
    include: { brand: true, category: true }
  })
  if (!item) throw createError({ statusCode: 404, statusMessage: 'Barang tidak ditemukan' })
  return item
})