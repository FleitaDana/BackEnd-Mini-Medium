import { CreatePostInputDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'

export class PostServiceImpl implements PostService {
  constructor(private readonly repository: PostRepository) { }

  async create(userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)
    return await this.repository.create(userId, data)
  }

  async getPosts(): Promise<PostDTO[]> {
    const posts = await this.repository.getPosts();
    return posts;
  }

  async deletePost(userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    await this.repository.delete(postId)
  }
}
