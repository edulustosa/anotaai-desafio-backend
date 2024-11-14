import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import { findProductById, findUserById } from '@/database/product'
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

product.get(
  '/:userId',
  zValidator(
    'param',
    z.object({
      userId: z.string().refine(findUserById, {
        message: 'user not found',
      }),
    }),
  ),
  async (c) => {
    const { userId } = c.req.valid('param')

    const products = await prisma.product.findMany({
      where: {
        ownerId: userId,
      },
    })

    return c.json({ products })
  },
)

product.put(
  '/:productId',
  zValidator(
    'param',
    z.object({
      productId: z
        .string()
        .refine(findProductById, { message: 'product not found' }),
    }),
  ),
  zValidator(
    'json',
    z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      price: z.number().optional(),
      categoryId: z
        .string()
        .refine(findCategoryById, {
          message: 'category not found',
        })
        .optional(),
    }),
  ),
  async (c) => {
    const { productId } = c.req.valid('param')
    const data = c.req.valid('json')

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data,
    })

    return c.json(updatedProduct)
  },
)

product.delete(
  '/:productId',
  zValidator(
    'param',
    z.object({
      productId: z
        .string()
        .refine(findProductById, { message: 'product not found' }),
    }),
  ),
  async (c) => {
    const { productId } = c.req.valid('param')

    await prisma.product.delete({
      where: { id: productId },
    })

    return c.json({ message: 'product deleted' })
  },
)

export default product
