import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'
import { db, BodyValidation } from '@utils'
import { UserRepositoryImpl } from '@domains/user/repository'
import { AuthService, AuthServiceImpl } from '../service'
import { LoginInputDTO, SignupInputDTO } from '../dto'

export const authRouter = Router()

// Use dependency injection
const service: AuthService = new AuthServiceImpl(new UserRepositoryImpl(db))

authRouter.post('/login', BodyValidation(LoginInputDTO), async (req: Request, res: Response) => {
  console.log(req)
  const data = req.body
  const token = await service.login(data)
  return res.status(HttpStatus.OK).json(token)
})


authRouter.post('/signup', BodyValidation(SignupInputDTO), async (req: Request, res: Response) => {
  console.log(req)
  const data = await req.body
  console.log("DATA", data)
  const token = await service.signup(data)

  return res.status(HttpStatus.CREATED).json(token)
})


