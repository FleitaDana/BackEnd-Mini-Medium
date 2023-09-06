import { CreatePostInputDTO, PostDTO } from '../dto'

export interface PostService {
  create: (userId: string, body: CreatePostInputDTO) => Promise<PostDTO>
  getPosts: ()=>  Promise<PostDTO[]> 
  deletePost: (userId: string, postId: string) => Promise<void>
}
