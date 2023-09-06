import { PrismaClient } from '@prisma/client'
import { CursorPagination } from '@types'
import { PostRepository } from '.'
import { CreatePostInputDTO, PostDTO } from '../dto'


export class PostRepositoryImpl implements PostRepository {
  constructor(private readonly db: PrismaClient) { }

  async create(userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async getPosts(): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
  
    return posts.map(post => new PostDTO(post));
  }

  async delete(postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId
      }
    })
  }

  async getById(postId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      }
    })
    return (post != null) ? new PostDTO(post) : null
  }

}