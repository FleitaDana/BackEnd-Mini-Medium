import { PrismaClient } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, PostDTO } from '../dto'
import { FollowRepository } from '@domains/follow/repository'

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

  /* async getAllByDatePaginated (options: CursorPagination): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })
    return posts.map(post => new PostDTO(post))
  } */

  //Metodo modificado para consigna 2

  async getAllByDatePaginated(options: CursorPagination, followedUserIds: string[]): Promise<PostDTO[]> {
    
    console.log("GetAllByDatePaginated",followedUserIds)
    
    const posts = await this.db.post.findMany({
      where: {
        // Filtramos por autores de cuentas públicas (isProfilePrivate: false) o autores seguidos por el usuario actual
        OR: [
          {
            author: {
              isProfilePrivate: false,
            },
          },
          {
            authorId: { in: followedUserIds },
          },
        ],
      },
      cursor: options.after ? { id: options.after } : options.before ? { id: options.before } : undefined,
      skip: options.after || options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          id: 'asc',
        },
      ],
    });

    return posts;
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

  async getByAuthorId(authorId: string): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId
      }
    })
    return posts.map(post => new PostDTO(post))
  }
}