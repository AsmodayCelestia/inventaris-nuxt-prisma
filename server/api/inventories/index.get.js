import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const q = getQuery(event)
  const search = q.search || ''
  const status = q.status || ''
  const unitIds = (q.unit_id || []).map(Number)
  const floorIds = (q.floor_id || []).map(Number)
  const roomIds = (q.room_id || []).map(Number)
  const page = Number(q.page) || 1
  const perPage = Number(q.per_page) || 10
  const skip = (page - 1) * perPage

  const where = {}
  if (status) where.status = status
  if (unitIds.length) where.unitId = { in: unitIds }
  if (roomIds.length) where.roomId = { in: roomIds }
  if (search) {
    where.OR = [
      { inventoryNumber: { contains: search, mode: 'insensitive' } },
      { item: { name: { contains: search, mode: 'insensitive' } } }
    ]
  }
  if (floorIds.length) where.room = { floorId: { in: floorIds } }

  const total = await prisma.inventory.count({ where })
  const items = await prisma.inventory.findMany({
    where, skip, take: perPage,
    include: {
      item: { select: { id: true, name: true } },
      room: { select: { id: true, name: true, floor: { select: { id: true, number: true } } } },
      unit: { select: { id: true, name: true } }
    },
    orderBy: { id: 'asc' }
  })

  const grandTotal = user.role === 'admin'
    ? await prisma.inventory.aggregate({
        where, _sum: { purchasePrice: true, estimatedDepreciation: true }
      })
    : null

  return {
    recordsTotal: await prisma.inventory.count(),
    recordsFiltered: total,
    data: items,
    grand_total: grandTotal
      ? { purchase: grandTotal._sum.purchasePrice || 0, depreciation: grandTotal._sum.estimatedDepreciation || 0 }
      : null
  }
})