import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import { findUserById } from '@/database/product'
import prisma from '@/lib/prisma'

const category = new Hono()

category.post(
  '/',
  zValidator(
    'json',
    z.object({
      title: z.string(),
      description: z.string(),
      ownerId: z.string().refine(findUserById, {
        message: 'user not found',
      }),
    }),
  ),
  async (c) => {
    const { title, description, ownerId } = c.req.valid('json')

    const createdCategory = await prisma.category.create({
      data: {
        title,
        description,
        ownerId,
      },
    })

    return c.json(createdCategory, 201)
  },
)

export default category
