import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import { findUserById } from '@/database/product'
import prisma from '@/lib/prisma'
import { findCategoryById } from '@/database/category'
import { publishSNSMessage } from '@/aws/sns'
import env from '@/env'

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

    publishSNSMessage(env.AWS_SNS_TOPIC_CATALOG_ARN, {
      ownerId,
    })

    return c.json(createdCategory, 201)
  },
)

category.get(
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

    const categories = await prisma.category.findMany({
      where: {
        ownerId: userId,
      },
    })

    return c.json({ categories })
  },
)

interface UpdateCategoryRequest {
  title?: string
  description?: string
  ownerId?: string
}

category.put(
  '/:categoryId',
  zValidator(
    'param',
    z.object({
      categoryId: z.string().refine(findCategoryById, {
        message: 'user not found',
      }),
    }),
  ),
  async (c) => {
    const { categoryId } = c.req.valid('param')
    const body = await c.req.json<UpdateCategoryRequest>()

    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: body,
    })

    publishSNSMessage(env.AWS_SNS_TOPIC_CATALOG_ARN, {
      ownerId: category.ownerId,
    })

    return c.json(category)
  },
)

category.delete(
  '/:categoryId',
  zValidator(
    'param',
    z.object({
      categoryId: z.string().refine(findCategoryById, {
        message: 'category not found',
      }),
    }),
  ),
  async (c) => {
    const { categoryId } = c.req.valid('param')

    await prisma.product.updateMany({
      where: {
        categoryId,
      },
      data: {
        categoryId: null,
      },
    })

    const deletedCategory = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    })

    publishSNSMessage(env.AWS_SNS_TOPIC_CATALOG_ARN, {
      ownerId: deletedCategory.ownerId,
    })

    return c.json({ message: 'category deleted' })
  },
)

export default category
