import { Request, Response, Router } from 'express'
import 'express-async-errors'
import { db, BodyValidation } from '@utils'
import { FollowRepositoryImpl } from '../repository'
import { FollowService, FollowServiceImpl } from '../service'

export const followRouter = Router()

// Use dependency injection
const FollowService = new FollowServiceImpl(new FollowRepositoryImpl(db))

// POST/api/follower/follow/:user_id  
followRouter.post('/follow/:user_id', async (req: Request, res: Response) => {
    const followedId  = req.params.user_id
    const { userId: followerId } = res.locals.context 

    const FollowDTO = await FollowService.createFollow(followerId, followedId)
    return res.json({ message: 'Usuario seguido', FollowDTO });
})

// POST /api/follower/unfollow/:user_id
followRouter.post('/unfollow/:user_id', async (req: Request, res: Response) => {
    const followerId = req.params.user_id
    const { userId: followedId } = res.locals.context

    await FollowService.deleteFollow(followerId, followedId)
    return res.json({ message: 'Dejo de seguir al usuario' });
})



