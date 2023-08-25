import { CursorPagination } from '@types'
import { CreatePostInputDTO, PostDTO } from '../dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getAllByDatePaginated(options: CursorPagination, followedUserIds: string[]): Promise<PostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<PostDTO | null>
  getByAuthorId: ( authorId: string, options: CursorPagination) => Promise<PostDTO[]>

  //Consigna 7
  
  createComment : (userId: string, data: CreatePostInputDTO, idPostComment: string) => Promise<PostDTO>

  //Consigna 8
  findComments: (userId: string) => Promise<PostDTO[]>
}
