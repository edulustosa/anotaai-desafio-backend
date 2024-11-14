import { Hono } from 'hono'

import prisma from '@/lib/prisma'

const user = new Hono()

user.post('/', async (c) => {
  const createdUser = await prisma.user.create({
    data: {},
  })

  return c.json(createdUser, 201)
})

export default user
