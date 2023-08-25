import { Request, Response, Router } from 'express'
import 'express-async-errors'
import { db } from '@utils'
import { ReactionRepositoryImpl } from '../repository'
import { ReactionServiceImpl } from '../service'
import { FollowRepositoryImpl } from '@domains/follow/repository'
import { UserRepositoryImpl } from '@domains/user/repository'
import { PostRepositoryImpl } from '@domains/post/repository'
import { ReactionBody } from '../dto'


export const reactionRouter = Router()

const postRepository = new PostRepositoryImpl(db);
const followRepository = new FollowRepositoryImpl(db);
const userRepository = new UserRepositoryImpl(db);
const reactionRepository = new ReactionRepositoryImpl(db);

const reactionService = new ReactionServiceImpl(reactionRepository, postRepository, followRepository, userRepository)

/**
 * @swagger
 * tags:
 *   name: Reaction
 *   description: Endpoints relacionados con las reacciones a las publicaciones
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description:  Id de la reacción
 *         userId:
 *           type: string
 *           description: Id del usuario que reaccionó
 *         postId:
 *           type: string
 *           description: Id de la publicación a la que se reaccionó
 *         type:
 *           type: string
 *           description: Tipo de reacción (LIKE o RETWEET)
 *         user:
 *           $ref: '#/components/schemas/User'
 *         post:
 *           $ref: '#/components/schemas/Post'
 */

/**
 * @swagger
 * /api/reaction/:post_id:
 *   post:
 *     summary: Crear una reacción a una publicación
 *     tags: [Reaction]
 *     parameters:
 *       - name: post_id
 *         in: path
 *         required: true
 *         description: Id de la publicación
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Datos de la reacción
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reaction'
 *     responses:
 *       200:
 *         description: Reacción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reaction'
 *       400:
 *         description: Solicitud incorrecta
 *       500:
 *         description: Error interno del servidor
 */
// POST api/reaction/:post_id
reactionRouter.post('/:post_id', async (req: Request, res: Response) => {
    const postId  = req.params.post_id
    const { userId } = res.locals.context 
    const data = req.body as ReactionBody

    const ReactionDTO = await reactionService.createReaction(userId, postId, data)
    return res.json({ message: 'Reaccion producida exitosamente', ReactionDTO });
})

/**
 * @swagger
 * /api/reaction/:post_id:
 *   delete:
 *     summary: Eliminar una reacción de una publicación
 *     tags: [Reaction]
 *     parameters:
 *       - name: post_id
 *         in: path
 *         required: true
 *         description: Id de la publicación
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Datos de la reacción
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reaction'
 *     responses:
 *       200:
 *         description: Reacción eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reaction'
 *       400:
 *         description: Solicitud incorrecta
 *       500:
 *         description: Error interno del servidor
 */
// DELETE api/reaction/:post_id
reactionRouter.delete('/:post_id', async (req: Request, res: Response) => {
    const postId  = req.params.post_id
    const { userId } = res.locals.context 
    const data = req.body as ReactionBody

    const ReactionDTO = await reactionService.deleteReaction(userId, postId, data)
    return res.json({ message: 'Reaccion eliminada exitosamente', ReactionDTO });
})

/**
 * @swagger
 * /api/reaction/retweets:
 *   get:
 *     summary: Obtener las reacciones de tipo RETWEET realizadas por el usuario
 *     tags: [Reaction]
 *     responses:
 *       200:
 *         description: Lista de reacciones de tipo RETWEET
 */
reactionRouter.get('/retweets', async (req: Request, res: Response) => {
    const { userId } = res.locals.context 

    const reaction = await reactionService.getRetweets(userId)
    return res.json({reaction});
})

/**
 * @swagger
 * /api/reaction/likes:
 *   get:
 *     summary: Obtener las reacciones de tipo LIKE realizadas por el usuario
 *     tags: [Reaction]
 *     responses:
 *       200:
 *         description: Lista de reacciones de tipo LIKE
 */
reactionRouter.get('/likes', async (req: Request, res: Response) => {
    const { userId } = res.locals.context 

    const reaction = await reactionService.getLikes(userId)
    return res.json({reaction});
})