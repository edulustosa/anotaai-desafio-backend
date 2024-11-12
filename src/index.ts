import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import env from './env'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

app.post(
  '/product',
  zValidator(
    'json',
    z.object({
      title: z.string().min(1),
      ownerId: z.string().min(1),
    }),
  ),
  (c) => {
    return c.text('Hello Hono!')
  },
)

const port = env.PORT
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
