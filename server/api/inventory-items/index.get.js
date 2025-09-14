import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const { search = '', category_id, brand_id } = getQuery(event)
  const where = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { isbn: { contains: search, mode: 'insensitive' } }
    ]
  }
  if (category_id) where.categoryId = Number(category_id)
  if (brand_id) where.brandId = Number(brand_id)

  const items = await prisma.inventoryItem.findMany({
    where,
    include: { brand: true, category: true },
    orderBy: { id: 'asc' }
  })
  return items
})