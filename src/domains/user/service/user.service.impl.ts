import { NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}

  async getUser (userId: any): Promise<UserDTO> {
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')
    return user
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserDTO[]> {
    // TODO: make this return only users followed by users the original user follows
    return await this.repository.getRecommendedUsersPaginated(options)
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }

  // async updateUser (userId: any, newData: Partial<UserDTO>): Promise<UserDTO | null> {
  //   await this.repository.update(userId, newData)
  // }

  async updateUser(userId: string, newData: boolean): Promise<void> {

    if (!userId) {
      throw new Error('ID de usuario inválido');
    }

    console.log('Valor de newData:', newData);

  
      // Verificar si el valor de newData es un booleano
      if (typeof newData !== 'boolean') {
        throw new Error('Valor de isProfilePrivate debe ser un booleano (true o false)');
      }

    try {
      await this.repository.update(userId, newData);
    } catch (error) {
      throw new Error('Error al actualizar el usuario');
    }
  }

}
