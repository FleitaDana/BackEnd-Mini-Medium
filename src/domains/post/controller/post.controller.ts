import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'
import { db, BodyValidation } from '@utils'
import { PostRepositoryImpl } from '../repository'
import { PostService, PostServiceImpl } from '../service'
import { CreatePostInputDTO } from '../dto'

export const postRouter = Router()

const service: PostService = new PostServiceImpl(new PostRepositoryImpl(db))

//Creamos un post
postRouter.post('/', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body

  const post = await service.create(userId, data)

  return res.status(HttpStatus.CREATED).json(post)
})


//Traemos todos los post
postRouter.get('/', async (req: Request, res: Response) => {
  /* const page = req.query.page as string; //Numero de page viniendo del front
  const parsedPage = parseInt(page); //Convertimos a number y lo guardamos 

  if (isNaN(parsedPage)) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid page number' }); //Contromalos que page sea un valor numerico
  }

  const pageSize = 10; // Definimos la cantidad de posts por página
  const offset = (parsedPage - 1) * pageSize; //Offset define número de elementos que se deben omitir antes de comenzar a recuperar los resultados de la página actual */

  const posts = await service.getPosts();

  return res.status(HttpStatus.OK).json(posts);
});


postRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  await service.deletePost(userId, postId)

  return res.status(HttpStatus.OK).send(`Deleted post ${postId}`)
})