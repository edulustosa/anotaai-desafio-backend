import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'

import env from './env'

import product from './http/routes/product'
import user from './http/routes/user'
import category from './http/routes/category'

const app = new Hono().basePath('/api')

app.use(logger())

app.route('/product', product)
app.route('/user', user)
app.route('/category', category)

const port = env.PORT
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
