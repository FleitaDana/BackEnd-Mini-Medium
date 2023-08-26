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

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints relacionados con la autenticación y registro de usuarios
 */

/**
 * @swagger
 * /api/auth/signup:
 *    post:
 *      summary: Crear nuevos usuarios
 *      tags: [Auth] 
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *            example: 
 *              username: Dana
 *              email: Dana@gmail.com
 *              password: dana123
 *      responses:
 *        200:
 *          description: Usuario creado
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        500:
 *          description: Error interno del servidor
 */
authRouter.post('/signup', BodyValidation(SignupInputDTO), async (req: Request, res: Response) => {
  const data = req.body

  const token = await service.signup(data)

  return res.status(HttpStatus.CREATED).json(token)
})

/**
 * @swagger
 * /api/auth/login:
 *    post:
 *      summary: Iniciar sesión
 *      tags: [Auth] 
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *            example: 
 *              username: Dana
 *              email: dana@gmail.com
 *              password: dana123
 *      responses:
 *        200:
 *          description: Usuario logeado
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        500:
 *          description: Error interno del servidor
 */
authRouter.post('/login', BodyValidation(LoginInputDTO), async (req: Request, res: Response) => {
  const data = req.body

  const token = await service.login(data)

  return res.status(HttpStatus.OK).json(token)
})
