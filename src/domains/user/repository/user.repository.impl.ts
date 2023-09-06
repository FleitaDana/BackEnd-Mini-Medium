import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient } from '@prisma/client'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO } from '../dto'
import { UserRepository } from './user.repository'

export class UserRepositoryImpl implements UserRepository {
    constructor(private readonly db: PrismaClient) { }

    async create (data: SignupInputDTO): Promise<UserDTO> {
        return await this.db.user.create({
          data
        }).then(user => new UserDTO(user))
      }

    async getByEmail(email: string): Promise<ExtendedUserDTO | null> {
        const user = await this.db.user.findUnique({
            where: {
                email: email,
            } 
        })
        return user ? new ExtendedUserDTO(user) : null
    }

    async getById (userId: any): Promise<UserDTO | null> {
      const user = await this.db.user.findUnique({
        where: {
          id: userId
        }
      })
      return user ? new UserDTO(user) : null
    }
      
}


