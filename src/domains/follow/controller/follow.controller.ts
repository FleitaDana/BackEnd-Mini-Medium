import { Request, Response, Router } from 'express'
import 'express-async-errors'
import { db, BodyValidation } from '@utils'
import { FollowRepositoryImpl } from '../repository'
import { FollowService, FollowServiceImpl } from '../service'

export const followRouter = Router()

// Use dependency injection
const FollowService = new FollowServiceImpl(new FollowRepositoryImpl(db))

/**
 * @swagger
 * components:
 *  schemas:
 *      Follow: 
 *          type: object 
 *          required: 
 *              - followerId
 *              - followedId
 *          properties:
 *            id: 
 *                type: string
 *                description: id autogenerado para follow
 *            followerId:
 *                type: string
 *                description: Id del seguidor
 *            followedId:
 *                type: string
 *                description: Id del usuario seguido
 *            createdAt:
 *                type: string
 *                format: date
 *                description: Fecha de creacion de follow
 *            updatedAt:
 *                type: string
 *                format: date
 *                description: Fecha de actualizacion de follow
 *            deletedAt:
 *                type: string
 *                format: date
 *                description: Fecha de eliminacion de follow
 */
/**

/**
 * @swagger
 * /api/follower/follow/{user_id}:
 *   post:
 *     summary: Seguir a un usuario
 *     tags: [Follower]
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: ID del usuario que se desea seguir
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario seguido
 */
followRouter.post('/follow/:user_id', async (req: Request, res: Response) => {
    const followedId  = req.params.user_id
    const { userId: followerId } = res.locals.context 

    const FollowDTO = await FollowService.createFollow(followerId, followedId)
    return res.json({ message: 'Usuario seguido', FollowDTO });
})

/**
 * @swagger
 * /api/follower/unfollow/{user_id}:
 *   post:
 *     summary: Dejar de seguir a un usuario
 *     tags: [Follower]
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: ID del usuario que se desea dejar de seguir
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dejo de seguir al usuario
 */
followRouter.post('/unfollow/:user_id', async (req: Request, res: Response) => {
    const followerId = req.params.user_id
    const { userId: followedId } = res.locals.context

    await FollowService.deleteFollow(followerId, followedId)
    return res.json({ message: 'Dejo de seguir al usuario' });
})
