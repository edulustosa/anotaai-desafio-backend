import { beforeEach, describe, expect, it } from 'vitest'
import UserUseCase from './user-use-case'
import type { UserRepository } from '@/database/repo/user-repository'
import InMemoryUserRepository from '@/database/repo/in-memory/in-memory-user-repository'

let sut: UserUseCase
let userRepository: UserRepository

describe('User use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new UserUseCase(userRepository)
  })

  it('should create user', async () => {
    const user = await sut.create()

    expect(user).toBeDefined()
  })
})
