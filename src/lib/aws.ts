import { SNSClient } from '@aws-sdk/client-sns'
import env from '@/env'

export const sns = new SNSClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})
