import { beforeEach, describe, expect, it } from 'vitest'
import CategoryUseCase from './category-use-case'
import type { UserRepository } from '@/database/repo/user-repository'
import type { CategoryRepository } from '@/database/repo/category-repository'
import InMemoryUserRepository from '@/database/repo/in-memory/in-memory-user-repository'
import InMemoryCategoryRepository from '@/database/repo/in-memory/in-memory-category.repository'
import { NotFoundError } from './errors'

let sut: CategoryUseCase
let userRepository: UserRepository
let categoryRepository: CategoryRepository

describe('Category use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    categoryRepository = new InMemoryCategoryRepository()
    sut = new CategoryUseCase(categoryRepository, userRepository)
  })

  it('should create a new category', async () => {
    const user = await userRepository.create()

    const category = await sut.create({
      title: 'Category 1',
      description: 'Description 1',
      ownerId: user.id,
    })

    expect(category).toEqual(
      expect.objectContaining({
        title: 'Category 1',
        description: 'Description 1',
        ownerId: user.id,
      }),
    )
  })

  it('should not create a new category if user does not exist', async () => {
    await expect(
      sut.create({
        title: 'Category 1',
        description: 'Description 1',
        ownerId: 'invalid-id',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})
