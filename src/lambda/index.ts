import { SQSEvent, SQSHandler, SQSRecord } from 'aws-lambda'
import { Db, MongoClient, ObjectId } from 'mongodb'

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const message of event.Records) {
    await processMessage(message)
  }
  console.log('done')
}

function connectToDatabase() {
  const uri = process.env.MONGO_URI || ''
  return new MongoClient(uri)
}

async function processMessage(message: SQSRecord) {
  const client = connectToDatabase()
  const db = client.db('anotaai')

  try {
    const ownerId = getOwnerIdFromBody(message.body)
    const catalog = await getCatalog(db, ownerId)
    console.log(catalog)
  } catch (err) {
    console.error(err)
  } finally {
    await client.close()
  }
}

function getOwnerIdFromBody(body: string) {
  const { Message }: { Message: string } = JSON.parse(body)
  const { ownerId }: { ownerId: string } = JSON.parse(Message)
  return ownerId
}

interface Catalog {
  ownerId: string
  catalog: {
    category_title: string
    category_description: string
    items: {
      title: string
      description: string
      price: number
    }[]
  }[]
}

async function getCatalog(db: Db, ownerId: string) {
  const categoryColl = db.collection('Category')
  const productColl = db.collection('Product')

  const catalog: Catalog = {
    ownerId,
    catalog: [],
  }

  const categories = await categoryColl
    .find({ ownerId: new ObjectId(ownerId) })
    .toArray()
  for (const category of categories) {
    const products = await productColl
      .find({ categoryId: category._id })
      .toArray()

    catalog.catalog.push({
      category_title: category.title,
      category_description: category.description,
      items: products.map((product) => ({
        title: product.title,
        description: product.description,
        price: product.price,
      })),
    })
  }

  return catalog
}
