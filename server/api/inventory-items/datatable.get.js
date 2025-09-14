import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user || !['admin','head'].includes(user.role)) throw createError({ statusCode: 403, statusMessage: 'Tidak punya akses' })

  const query = getQuery(event)
  const search = (query.search?.value || '').trim()
  const start = parseInt(query.start) || 0
  const length = parseInt(query.length) || 10

  const where = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { isbn: { contains: search, mode: 'insensitive' } }
    ]
  }

  const [recordsTotal, recordsFiltered, data] = await prisma.$transaction([
    prisma.inventoryItem.count(),
    prisma.inventoryItem.count({ where }),
    prisma.inventoryItem.findMany({
      where,
      include: { brand: true, category: true },
      skip: start,
      take: length,
      orderBy: { id: 'asc' }
    })
  ])

  return {
    draw: parseInt(query.draw) || 1,
    recordsTotal,
    recordsFiltered,
    data
  }
})