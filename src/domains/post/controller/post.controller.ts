import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'
import { db, BodyValidation } from '@utils'
import { PostRepositoryImpl } from '../repository'
import { PostService, PostServiceImpl } from '../service'
import { CreatePostInputDTO } from '../dto'
import { FollowRepositoryImpl } from '@domains/follow/repository'
import { UserRepositoryImpl } from '@domains/user/repository'

export const postRouter = Router()


// Creamos las instancias de los repositorios y el servicio utilizando la inyección de dependencias
const postRepository = new PostRepositoryImpl(db);
const followRepository = new FollowRepositoryImpl(db);
const userRepository = new UserRepositoryImpl(db);
const service: PostService = new PostServiceImpl(postRepository, followRepository, userRepository);


/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Endpoints relacionados con los posts
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Post:
 *      type: object
 *      required: 
 *        - authorId
 *        - content
 *      properties:
 *        id:
 *          type: string
 *          description: ID del post
 *        authorId:
 *          type: string
 *          description: ID del autor del post
 *        content:
 *          type: string
 *          description: Contenido del post
 *        images:
 *          type: array
 *          items:
 *            type: string
 *          description: Lista de URLs de imágenes asociadas al post
 *        createdAt:
 *          type: string
 *          format: date-time
 *          description: Fecha de creación del post
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          description: Fecha de actualización del post
 *        deletedAt:
 *          type: string
 *          format: date-time
 *          description: Fecha de eliminación del post (si aplica)
 *        comment:
 *          type: boolean
 *          description: Indica si el post es un comentario
 *        idPostComment:
 *          type: string
 *          description: ID del post al que hace referencia el comentario (si es un comentario)
 *        author:
 *          type: object
 *          description: Autor del post
 *          $ref: '#/components/schemas/User'
 *        reactions:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Reaction'
 *          description: Lista de reacciones asociadas al post
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Obtener los posts más recientes
 *     tags: [Post]
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *         description: Cantidad máxima de posts a obtener
 *       - name: before
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Obtener posts antes de esta fecha y hora
 *       - name: after
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Obtener posts después de esta fecha y hora
 *     responses:
 *       200:
 *         description: Lista de posts
 */
postRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, before, after } = req.query as Record<string, string>

  const posts = await service.getLatestPosts(userId, { limit: Number(limit), before, after })

  return res.status(HttpStatus.OK).json(posts)
})

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Obtener información de un post por su Id
 *     tags: [Post]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: Id del post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Información del post
 */
//Consigna 4 y 7
postRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  const post = await service.getPost(userId, postId)

  return res.status(HttpStatus.OK).json(post)
})

/**
 * @swagger
 * /api/posts/by_user/{userId}:
 *   get:
 *     summary: Obtener los posts de un usuario por su Id
 *     tags: [Post]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: Id del usuario
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *         description: Cantidad máxima de posts a obtener
 *       - name: before
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Obtener posts antes de esta fecha y hora
 *       - name: after
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Obtener posts después de esta fecha y hora
 *     responses:
 *       200:
 *         description: Lista de posts de un usuario
 */
//Consigna 4
postRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: authorId } = req.params
  const { limit, before, after } = req.query as Record<string, string>

  const posts = await service.getPostsByAuthor(userId, authorId, { limit: Number(limit), before, after })

  return res.status(HttpStatus.OK).json(posts)
})

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Crear un nuevo post
 *     tags: [Post]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInputDTO'
 *     responses:
 *       201:
 *         description: Post creado exitosamente
 */
postRouter.post('/', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body

  const post = await service.createPost(userId, data)

  return res.status(HttpStatus.CREATED).json(post)
})

/**
 * @swagger
 * /api/posts/{idPostComment}:
 *   post:
 *     summary: Crear un nuevo comentario en un post
 *     tags: [Post]
 *     parameters:
 *       - name: idPostComment
 *         in: path
 *         required: true
 *         description: Id del post en el cual se creará el comentario
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInputDTO'
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 */
//Consigna 7 para crear un comentario
postRouter.post('/:idPostComment', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { idPostComment } = req.params
  const data = req.body

  const comment = await service.createComment(userId, data, idPostComment)

  return res.status(HttpStatus.CREATED).json(comment)
})

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Eliminar un post por su Id
 *     tags: [Post]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: ID del post a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post eliminado exitosamente
 */
postRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  await service.deletePost(userId, postId)

  return res.status(HttpStatus.OK).send(`Deleted post ${postId}`)
})

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Obtener información de un post por su Id
 *     tags: [Post]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: Id del post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Información del post
 */
//Consigna 7
postRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  const post = await service.getPost(userId, postId)

  return res.status(HttpStatus.OK).json(post)
})

/**
 * @swagger
 * /api/posts/comments:
 *   get:
 *     summary: Obtener los comentarios realizados por el usuario
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Lista de comentarios
 */
//Consigna 8
postRouter.get('/comments', async (req: Request, res: Response) => {
  const { userId } = res.locals.context 

  const comments = await service.getComments(userId)
  return res.json({comments});
})