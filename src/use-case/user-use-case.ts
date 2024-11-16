import type { UserRepository } from '@/database/repo/user-repository'

export default class UserUseCase {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  create() {
    return this.userRepository.create()
  }
}
