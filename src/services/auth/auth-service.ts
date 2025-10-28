import { AuthRepository } from "@/repositories/auth/auth-repository"
import {
  CreateUserValues,
  LoginUserValues,
  PublicUser,
} from "@/types/auth/types"

export class AuthService {
  private authRepository: AuthRepository

  constructor() {
    this.authRepository = new AuthRepository()
  }

  async createUser(values: CreateUserValues): Promise<PublicUser> {
    return await this.authRepository.createUser(values)
  }

  async loginUser(values: LoginUserValues): Promise<PublicUser> {
    return await this.authRepository.loginUser(values)
  }

  async getUser(): Promise<PublicUser> {
    return await this.authRepository.getUser()
  }

  async getUserById(id: string): Promise<PublicUser> {
    return await this.authRepository.getUserById(id)
  }

  async logoutUser(): Promise<void> {
    return await this.authRepository.logoutUser()
  }
}
