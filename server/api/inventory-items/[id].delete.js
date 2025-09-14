import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user || user.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Admin only' })

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' })

  const count = await prisma.inventory.count({ where: { inventoryItemId: id } })
  if (count > 0) throw createError({ statusCode: 400, statusMessage: 'Masih memiliki unit inventaris' })

  await prisma.inventoryItem.delete({ where: { id } })
  setResponseStatus(event, 204)
  return null
})