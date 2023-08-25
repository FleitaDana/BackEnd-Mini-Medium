import { db } from '@utils';
import { PrismaClient } from '@prisma/client'
import { ReactionBody, ReactionDTO, ReactionType} from '../dto'
import { ReactionRepository } from './reaction.repository'

export class ReactionRepositoryImpl implements ReactionRepository {

    constructor(private readonly db: PrismaClient) { }

    async createReaction(userId: string, postId: string, data: ReactionBody): Promise<ReactionDTO> {

        const reaction = await this.db.reaction.create({
            data: {
                userId: userId,
                postId: postId,
                type: data.type
            },
        }) as ReactionDTO;

        return new ReactionDTO(reaction);

    }

    async findReaction(userId: string, postId: string, data: ReactionBody): Promise<ReactionDTO | null> {
        const reaction = await this.db.reaction.findFirst({
            where: {
                userId: userId,
                postId: postId,
            }, 
        })as ReactionDTO;

        return reaction ;
    }

    async delete(reactionId: string): Promise<void> {
        await this.db.reaction.delete({
          where: {
            id: reactionId
          }
        })
      }

      async findAllRetweets(userId: string): Promise<ReactionDTO[]> {
        const reactions = await this.db.reaction.findMany({
            where: {
                userId: userId,
                type: ReactionType.RETWEET, // Asegúrate de usar el valor correcto de tu enumeración ReactionType
            },
        }) as ReactionDTO[];
    
        return reactions.map((reaction) => new ReactionDTO(reaction)); 
    }

    async findAllLikes(userId: string): Promise<ReactionDTO[]> {
        const reactions = await this.db.reaction.findMany({
            where: {
                userId: userId,
                type: ReactionType.LIKE,
            },
        }) as ReactionDTO[];
    
        return reactions.map((reaction) => new ReactionDTO(reaction)); 
    }
}



