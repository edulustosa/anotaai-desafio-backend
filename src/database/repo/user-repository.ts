import type { User } from '@prisma/client'

export interface UserRepository {
  create(): Promise<User>
  findById(id: string): Promise<User | null>
}
