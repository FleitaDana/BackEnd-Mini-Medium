import { CreatePostInputDTO, PostDTO } from '../dto'

export interface PostService {
  createPost: (userId: string, body: CreatePostInputDTO) => Promise<PostDTO>
  deletePost: (userId: string, postId: string) => Promise<void>
  getPost: (userId: string, postId: string) => Promise<PostDTO>
  getLatestPosts: (userId: string, options: { limit?: number, before?: string, after?: string }) => Promise<PostDTO[]>
  getPostsByAuthor: (userId: any, authorId: string, options: { limit?: number, before?: string, after?: string }) => Promise<PostDTO[]>

  //Metodo para consigna 7
  createComment: (userId: string, body: CreatePostInputDTO, idPostComment: string) => Promise<PostDTO>

  //Metodo para consigna 8
  getComments: (userId : string ) => Promise<PostDTO[]>;
}
