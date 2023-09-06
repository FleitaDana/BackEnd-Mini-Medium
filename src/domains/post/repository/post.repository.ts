
import { CreatePostInputDTO, PostDTO } from '../dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getPosts: () => Promise<PostDTO[]> 
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<PostDTO | null>
}
