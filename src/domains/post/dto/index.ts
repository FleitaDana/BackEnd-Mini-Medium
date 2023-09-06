import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreatePostInputDTO {

  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  title!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  content!: string

}

export class PostDTO {
  constructor(post: PostDTO) {
    this.id = post.id
    this.authorId = post.authorId
    this.title = post.title
    this.content = post.content
    this.createdAt = post.createdAt

  }

  id: string
  authorId: string
  content: string
  createdAt: Date
  title: string
}