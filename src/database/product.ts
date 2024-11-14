import prisma from '@/lib/prisma'

export async function findUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id } })
    return user
  } catch {
    return null
  }
}
