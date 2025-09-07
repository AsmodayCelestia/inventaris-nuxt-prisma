import { prisma } from '~~/server/utils/prisma'
import { sterilBigInt } from '~~/server/utils/serialize'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  let body = await readBody(event)

  body.password = await bcrypt.hash(body.password, 10)
  delete body.password_confirmation

  /* kalau division_id dikirim sebagai string, ubah jadi BigInt */
  if (body.division_id) body.division_id = BigInt(body.division_id)

  const created = await prisma.users.create({ data: body })
  return sterilBigInt(created)
})