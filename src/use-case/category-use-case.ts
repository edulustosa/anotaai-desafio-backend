import type { Prisma } from '@prisma/client'

import { NotFoundError } from './errors'
import type { CategoryRepository } from '@/database/repo/category-repository'
import type { UserRepository } from '@/database/repo/user-repository'

export default class CategoryUseCase {
  private categoryRepository: CategoryRepository
  private userRepository: UserRepository

  constructor(
    categoryRepository: CategoryRepository,
    userRepository: UserRepository,
  ) {
    this.categoryRepository = categoryRepository
    this.userRepository = userRepository
  }

  async create(category: Prisma.CategoryUncheckedCreateInput) {
    const owner = await this.userRepository.findById(category.ownerId)
    if (!owner) {
      throw new NotFoundError('user not found')
    }

    return this.categoryRepository.create(category)
  }
}
