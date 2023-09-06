import { Router } from 'express'
import { withAuth } from '@utils'
import { postRouter } from '@domains/post/controller'
import { userRouter} from '@domains/user/controller'
import { authRouter } from '@domains/auth'


export const router = Router()


router.use('/auth', authRouter)
router.use('/post', withAuth, postRouter)
router.use('/user', withAuth,  userRouter)


