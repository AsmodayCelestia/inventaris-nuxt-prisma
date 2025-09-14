import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' })

  const data = await prisma.inventory.findUnique({
    where: { id },
    include: {
      item: { include: { brand: true, category: true } },
      room: { include: { floor: true } },
      unit: true,
      personInCharge: true,
      maintenances: { orderBy: { createdAt: 'desc' }, take: 1 }
    }
  })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Unit tidak ditemukan' })

  const canSeePrice = user.role === 'admin' || user.division?.name === 'Keuangan'
  if (!canSeePrice) {
    delete data.purchasePrice
    delete data.estimatedDepreciation
  }
  return data
})