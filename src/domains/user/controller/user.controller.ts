import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'

import { db } from '@utils'

import { UserRepositoryImpl } from '../repository'
import { UserService, UserServiceImpl } from '../service'

export const userRouter = Router()

// Use dependency injection
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db))

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: Object
 *      required: 
 *        - username
 *        - email
 *        - password
 *      properties:
 *        id: 
 *          type: string 
 *          description: Id autogenerado
 *        username:
 *          type: string 
 *          description: Username del usuario
 *        name:
 *          type: string 
 *          description: Name del usuario
 *        email:
 *          type: string 
 *          description: Email del usuario
 *        password:
 *          type: string 
 *          description: Contraseña del usuario
 *        createdAt:
 *          type: string  
 *          format: date
 *          description: Fecha de creacion del usuario
 *        updatedAt:
 *          type: string  
 *          format: date
 *          description: Fecha de actualizacion del usuario
 *        deletedAt:
 *          type: string  
 *          format: date
 *          description: Fecha de eliminacion del usuario
 *        isProfilePrivate:
 *          type: boolean
 *          description: Informacion del usuario si tiene perfil publico o privado
 *      example:
 *        id: f810b615-8467-4228-8197-e75fb4cbfe53
 *        username: Dana
 *        name: Dana
 *        email: dana@gmail.com
 *        password: dana123
 *        createdAt: 2023-07-29T02:05:23.929Z
 *        isProfilePrivate: false
 */


/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Obtener recomendaciones de usuarios
 *     tags: [User]
 *     responses:
 *       200:
 *          description: Lista de usuarios recomendados
 */
userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, skip } = req.query as Record<string, string>

  const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) })

  return res.status(HttpStatus.OK).json(users)
})

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Obtener información del usuario actual
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Información del usuario actual
 */
userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const user = await service.getUser(userId)

  return res.status(HttpStatus.OK).json(user)
})

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Obtener información de un usuario por su Id
 *     tags: [User]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: Id del usuario que se recupera del endpoint
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Información del usuario
 */
userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params

  const user = await service.getUser(otherUserId)

  return res.status(HttpStatus.OK).json(user)
})

/**
 * @swagger
 * /api/user:
 *   delete:
 *     summary: Eliminar al usuario actual
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 */
userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.deleteUser(userId)

  return res.status(HttpStatus.OK)
})

/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: Actualizar configuración del usuario actual
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isProfilePrivate:
 *                 type: boolean
 *             required:
 *               - isProfilePrivate
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 */
userRouter.put('/', async (req: Request, res: Response) => {

  const { userId } = res.locals.context;

  // Extraemos los nuevos datos a actualizar del cuerpo de la solicitud
  const { isProfilePrivate } = req.body;

  await service.updateUser(userId, isProfilePrivate);

  // Envía una respuesta de éxito al cliente
  return res.status(HttpStatus.OK).json({ message: 'Usuario actualizado exitosamente' }); 
});


