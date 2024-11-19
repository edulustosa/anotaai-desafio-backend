import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import { findUserById } from '@/database/product'
import { findCategoryById } from '@/database/category'
import prisma from '@/lib/prisma'
import { publishSNSMessage } from '@/aws/sns'
import env from '@/env'

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

    const createdProduct = await prisma.product.create({
      data,
    })

    console.log(env.AWS_SNS_TOPIC_CATALOG_ARN)
    publishSNSMessage(env.AWS_SNS_TOPIC_CATALOG_ARN, {
      ownerId: createdProduct.ownerId,
    })

    return c.json(createdProduct, 201)
  },
)

product.get(
  '/:ownerId',
  zValidator(
    'param',
    z.object({
      ownerId: z.string(),
    }),
  ),
  async (c) => {
    const { ownerId } = c.req.valid('param')

    const products = await prisma.product.findMany({
      where: {
        ownerId,
      },
    })

    return c.json(products)
  },
)

product.put(
  '/:productId',
  zValidator('param', z.object({ productId: z.string() })),
  zValidator(
    'json',
    z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      price: z.number().optional(),
      ownerId: z
        .string()
        .refine(findUserById, {
          message: 'user not found',
        })
        .optional(),
      categoryId: z
        .string()
        .refine(findCategoryById, {
          message: 'user not found',
        })
        .optional(),
    }),
  ),
  async (c) => {
    const { productId } = c.req.valid('param')
    const data = c.req.valid('json')

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data,
    })

    publishSNSMessage(env.AWS_SNS_TOPIC_CATALOG_ARN, {
      ownerId: updatedProduct.ownerId,
    })

    return c.json(updatedProduct)
  },
)

product.delete(
  '/:productId',
  zValidator('param', z.object({ productId: z.string() })),
  async (c) => {
    const { productId } = c.req.valid('param')

    await prisma.product.delete({
      where: {
        id: productId,
      },
    })

    return c.json({ message: 'Product deleted' })
  },
)

export default product
