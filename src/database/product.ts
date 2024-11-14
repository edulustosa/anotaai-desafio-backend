import prisma from '@/lib/prisma'

export async function findUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id } })
    return user
  } catch {
    return null
  }
}

export async function findProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({ where: { id } })
    return product
  } catch {
    return null
  }
}
