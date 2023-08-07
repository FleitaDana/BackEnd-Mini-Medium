import { CreatePostInputDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException } from '@utils'
import { CursorPagination } from '@types'
import { FollowRepository } from '@domains/follow/repository'

export class PostServiceImpl implements PostService {
  constructor (private readonly repository: PostRepository,
               private readonly followRepository: FollowRepository ) {}

  async createPost (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)
    return await this.repository.create(userId, data)
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    // TODO: validate that the author has public profile or the user follows the author
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')


    return post
  }


 /*  //Metodo consigna 4
  async getPost(userId: string, postId: string): Promise<PostDTO> {

    // Obtenemos el post desde el repositorio
    const post = await this.repository.getById(postId);

    // Verificamos si el post existe. Si no existe, lanzamos una excepción.
    if (!post) throw new NotFoundException('post');

    // Verificamos si el autor tiene una cuenta privada
    const isAuthorPrivate = post.author.isProfilePrivate;

    // Si el autor tiene una cuenta privada, verificar si el usuario sigue al autor
    if (isAuthorPrivate) {
      const isFollowingAuthor = await this.repository.isUserFollowing(userId, post.authorId);

      // Si el usuario no sigue al autor, lanzar una excepción.
      if (!isFollowingAuthor) throw new NotFoundException('post');
    }

    // Si todo está bien, devolver el post
    return post;
  }
 */




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
  
  
  async getPostsByAuthor (userId: any, authorId: string): Promise<PostDTO[]> {
    // TODO: throw exception when the author has a private profile and the user doesn't follow them
    return await this.repository.getByAuthorId(authorId)
  }
}
