import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user || !['admin','head'].includes(user.role)) throw createError({ statusCode: 403, statusMessage: 'Tidak punya akses' })

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' })

  const body = await readBody(event)
  const { name, brandId, categoryId, manufacture_year, isbn, quantity } = body

  const updated = await prisma.inventoryItem.update({
    where: { id },
    data: {
      name,
      brandId: Number(brandId),
      categoryId: Number(categoryId),
      manufacture_year,
      isbn,
      quantity: Number(quantity)
    }
  })
  return updated
})