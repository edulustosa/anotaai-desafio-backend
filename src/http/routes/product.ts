import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import { findUserById } from '@/database/product'
import { findCategoryById } from '@/database/category'
import prisma from '@/lib/prisma'

const product = new Hono()

product.post(
  '/',
  zValidator(
    'json',
    z.object({
      title: z.string(),
      description: z.string(),
      price: z.number(),
      ownerId: z.string().refine(findUserById, {
        message: 'user not found',
      }),
      categoryId: z.string().refine(findCategoryById, {
        message: 'category not found',
      }),
    }),
  ),
  async (c) => {
    const data = c.req.valid('json')

    const createdCategory = await prisma.product.create({
      data,
    })

    return c.json(createdCategory, 201)
  },
)

export default product
