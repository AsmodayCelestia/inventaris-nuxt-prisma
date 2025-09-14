import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  const { inventoryItemId, procurement_date, acquisition_source, purchase_price, unit_id, room_id, status, description = '' } = body

  const master = await prisma.inventoryItem.findUnique({ where: { id: Number(inventoryItemId) } })
  if (!master) throw createError({ statusCode: 404, statusMessage: 'Master barang tidak ditemukan' })

  const room = await prisma.room.findUnique({
    where: { id: Number(room_id) },
    include: { floor: { select: { code: true } } }
  })
  if (!room) throw createError({ statusCode: 404, statusMessage: 'Ruangan tidak ditemukan' })

  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  const counter = await prisma.inventory.count()
  const inventoryNumber = `${y}${m}${d}${room.floor.code}${counter + 1}`

  const created = await prisma.inventory.create({
    data: {
      inventoryNumber,
      inventoryItemId: Number(inventoryItemId),
      procurement_date: new Date(procurement_date),
      acquisition_source,
      purchase_price: Number(purchase_price),
      unit_id: Number(unit_id),
      room_id: Number(room_id),
      status,
      description
    }
  })

  await prisma.inventoryItem.update({ where: { id: Number(inventoryItemId) }, data: { quantity: { increment: 1 } } })

  setResponseStatus(event, 201)
  return created
})