import type { User } from '@prisma/client'
import type { UserRepository } from '../user-repository'
import { randomUUID } from 'crypto'

export default class InMemoryUserRepository implements UserRepository {
  public users: User[] = []

  async create() {
    const user: User = {
      id: randomUUID(),
    }
    this.users.push(user)
    return user
  }

  async findById(id: string) {
    const user = this.users.find((user) => user.id === id)
    return user || null
  }
}
