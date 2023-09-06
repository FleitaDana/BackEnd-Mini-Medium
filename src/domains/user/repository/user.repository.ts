import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO } from '../dto'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  getByEmail: (email: string) => Promise<ExtendedUserDTO | null>
  getById: (userId: string) => Promise <UserDTO | null>
}
