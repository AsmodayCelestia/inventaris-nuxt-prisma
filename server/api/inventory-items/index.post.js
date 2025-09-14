import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user || !['admin','head'].includes(user.role)) throw createError({ statusCode: 403, statusMessage: 'Tidak punya akses' })

  const body = await readBody(event)
  const { name, brandId, categoryId, manufacture_year, isbn = '', quantity = 0 } = body

  const created = await prisma.inventoryItem.create({
    data: {
      name,
      brandId: Number(brandId),
      categoryId: Number(categoryId),
      manufacture_year,
      isbn,
      quantity: Number(quantity)
    }
  })
  setResponseStatus(event, 201)
  return created
})