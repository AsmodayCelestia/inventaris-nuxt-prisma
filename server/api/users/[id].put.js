import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  let body = await readBody(event)

  if (body.password) {
    body.password = await bcrypt.hash(body.password, 10)
  } else {
    delete body.password
  }
  delete body.password_confirmation

  if (body.division_id) body.division_id = BigInt(body.division_id)

  const updated = await prisma.users.update({
    where: { id: BigInt(id) },   // <-- BigInt
    data: body
  })
  return sterilBigInt(updated)
})