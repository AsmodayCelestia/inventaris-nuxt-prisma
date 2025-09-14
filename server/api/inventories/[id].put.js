import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const allowed = user.role === 'admin' || user.role === 'head' || (user.role === 'karyawan' && user.division?.name === 'Keuangan')
  if (!allowed) throw createError({ statusCode: 403, statusMessage: 'Tidak punya akses' })

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' })

  const body = await readBody(event)
  const { procurement_date, acquisition_source, purchase_price, unit_id, room_id, status, description = '' } = body

  const updated = await prisma.inventory.update({
    where: { id },
    data: {
      procurement_date: new Date(procurement_date),
      acquisition_source,
      purchase_price: Number(purchase_price),
      unit_id: Number(unit_id),
      room_id: Number(room_id),
      status,
      description
    }
  })
  return updated
})