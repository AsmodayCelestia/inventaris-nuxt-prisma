// server/api/inventories/table.get.js
import { getQuery, createError } from 'h3'
import { sterilBigInt } from '~/server/utils/serialize'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const q = getQuery(event)
  const search = (q.search ?? '').trim()
  const status = q.status ?? ''
  const unitIds = (q.unit_id ?? []).map(Number).filter(Boolean)
  const roomIds = (q.room_id ?? []).map(Number).filter(Boolean)
  const floorIds = (q.floor_id ?? []).map(Number).filter(Boolean)
  const page = Number(q.page ?? 1)
  const perPage = Number(q.per_page ?? 10)
  const skip = (page - 1) * perPage

  // gate harga
  const canSeePrice =
    user.role === 'admin' ||
    user.division?.name === 'Keuangan' ||
    (user.role === 'head' && user.division?.name === 'Umum')

  // base query
  const where = {}
  if (status) where.status = status
  if (unitIds.length) where.unit_id = { in: unitIds }
  if (roomIds.length) where.room_id = { in: roomIds }

  if (search) {
    where.OR = [
      { inventory_number: { contains: search, mode: 'insensitive' } },
      { inventory_items: { name: { contains: search, mode: 'insensitive' } } }
    ]
  }

  if (floorIds.length) {
    where.rooms = { floor_id: { in: floorIds } }
  }

  // hitung total & grand total
  const recordsFiltered = await prisma.inventories.count({ where })
  const recordsTotal = await prisma.inventories.count()

  const grandTotalRaw = canSeePrice
    ? await prisma.inventories.aggregate({
        where,
        _sum: { purchase_price: true, estimated_depreciation: true }
      })
    : { _sum: { purchase_price: 0, estimated_depreciation: 0 } }

  const grandTotal = {
    purchase: Number(grandTotalRaw._sum.purchase_price ?? 0),
    depreciation: Number(grandTotalRaw._sum.estimated_depreciation ?? 0)
  }

  // data paginated
  const data = await prisma.inventories.findMany({
    where,
    skip,
    take: perPage,
    include: {
      inventory_items: { select: { id: true, name: true } },
      rooms: {
        select: {
          id: true,
          name: true,
          floors: { select: { id: true, number: true } }
        }
      },
      location_units: { select: { id: true, name: true } }
    },
    orderBy: { id: 'asc' }
  })

  return sterilBigInt({
    recordsTotal,
    recordsFiltered,
    data,
    grand_total: grandTotal
  })
})