import type { Category, Prisma } from '@prisma/client'

export interface CategoryRepository {
  create(category: Prisma.CategoryUncheckedCreateInput): Promise<Category>
}
