import { OffsetPagination } from '@types'
import { UserDTO } from '../dto'

export interface UserService {

  getUser: (userId: any) => Promise<UserDTO>
}
