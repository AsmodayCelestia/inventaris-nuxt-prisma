import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' })

  const unit = await prisma.inventory.findUnique({ where: { id }, select: { inventoryItemId: true } })
  if (!unit) throw createError({ statusCode: 404, statusMessage: 'Unit tidak ditemukan' })

  await prisma.inventory.delete({ where: { id } })
  await prisma.inventoryItem.update({ where: { id: unit.inventoryItemId }, data: { quantity: { decrement: 1 } } })

  setResponseStatus(event, 204)
  return null
})