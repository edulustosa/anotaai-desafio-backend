import { sns } from '@/lib/aws'
import { PublishCommand } from '@aws-sdk/client-sns'

interface Message {
  ownerId: string
}

export async function publishSNSMessage(topicArn: string, message: Message) {
  const response = await sns.send(
    new PublishCommand({
      TopicArn: topicArn,
      Message: JSON.stringify(message),
    }),
  )

  console.log(response)
}
