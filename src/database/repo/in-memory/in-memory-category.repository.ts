import type { Category } from '@prisma/client'
import type { CategoryRepository } from '../category-repository'

export default class InMemoryCategoryRepository implements CategoryRepository {
  public categories: Category[] = []

  async create(category: Category) {
    this.categories.push(category)
    return category
  }
}
