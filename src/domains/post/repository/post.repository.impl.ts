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
        idPostComment: null,
        ...data
      }
    })
    return new PostDTO(post)
  }

  //Metodo para consigna 7
  async createComment(userId: string, data: CreatePostInputDTO, idPostComment: string): Promise<PostDTO> {
    const comment = await this.db.post.create({
      data: {
        authorId: userId,
        idPostComment: idPostComment,
        comment: true,
        ...data
      }
    })
    return new PostDTO(comment)
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

    console.log("GetAllByDatePaginated", followedUserIds)

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

  //Metodo para consigna 4
  async getByAuthorId(authorId: string, options: CursorPagination): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId
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
    })

    return posts.map(post => new PostDTO(post))
  }

//Metodo para consigna 8
  async findComments(userId: string): Promise<PostDTO[]> {
    const comments = await this.db.post.findMany({
        where: {
            authorId: userId,
        },
    });

    return comments.map((comment) => new PostDTO(comment));
}
}
