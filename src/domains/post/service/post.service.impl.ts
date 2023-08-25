import { CreatePostInputDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFollow, NotFoundException } from '@utils'
import { CursorPagination } from '@types'
import { FollowRepository } from '@domains/follow/repository'
import { UserRepository } from '@domains/user/repository'

export class PostServiceImpl implements PostService {
  constructor(private readonly repository: PostRepository,
    private readonly followRepository: FollowRepository,
    private readonly userRepository: UserRepository) { }

  async createPost(userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)
    return await this.repository.create(userId, data)
  }

  //Consiga 7
  async createComment(userId: string, data: CreatePostInputDTO, idPostComment: string): Promise<PostDTO> {
    await validate(data)
    return await this.repository.createComment(userId, data, idPostComment)
  }

  async deletePost(userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }


  //Metodo consigna 4
  async getPost(userId: string, postId: string): Promise<PostDTO> {
    // TODO: validate that the author has public profile or the user follows the author

    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')

    const author = await this.userRepository.getById(post.authorId)

    if (author?.isProfilePrivate == false) {
      return post
    }

    const follow = await this.followRepository.following(userId, post.authorId)

    if ((author?.isProfilePrivate == true) && (follow == true)) {
      return post
    } else {
      throw new NotFollow
    }

  }

  /* async getLatestPosts (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    // TODO: filter post search to return posts from authors that the user follows
    return await this.repository.getAllByDatePaginated(options)
  } */



  //Metodo para la consigna 2
  async getLatestPosts(userId: string, options: CursorPagination): Promise<PostDTO[]> {

    // Obtenemos la lista de usuarios seguidos por el usuario actual (userId)
    const followedUserIds = await this.followRepository.getFollowedUsers(userId);

    // Agregamos el propio ID del usuario para incluir también las publicaciones del usuario actual en los resultados
    followedUserIds.push(userId);

    const posts = await this.repository.getAllByDatePaginated(options, followedUserIds);

    return posts.map((post) => new PostDTO(post));
  }

  //Metodo para la consigna 4
  async getPostsByAuthor(userId: any, authorId: string, options: CursorPagination): Promise<PostDTO[]> {
    // TODO: throw exception when the author has a private profile and the user doesn't follow them

    const post = await this.repository.getByAuthorId(authorId, options)

    if (!post) throw new NotFoundException('post')

    const author = await this.userRepository.getById(authorId)

    if (author?.isProfilePrivate == false) {
      return post
    }

    const follow = await this.followRepository.following(userId, authorId)

    if ((author?.isProfilePrivate == true) && (follow == true)) {
      return post
    } else {
      throw new NotFollow
    }

  }

  //Consigna 8
  async getComments(userId: string): Promise<PostDTO[]> {

    const comments = await this.repository.findComments(userId);

    if (comments.length === 0) {
      throw new Error('El usuario aun no realizo comentarios');
    }

    return comments.map((comment) => new PostDTO(comment));

  }
}
