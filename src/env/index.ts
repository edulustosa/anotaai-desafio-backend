import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('production'),
  PORT: z.coerce.number().default(3000),
  AWS_ACCESS_KEY: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_SNS_TOPIC_CATALOG_ARN: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables')
}

const env = _env.data
export default env
