import prisma from '@/lib/prisma'

export async function findCategoryById(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  })

  return category
}
