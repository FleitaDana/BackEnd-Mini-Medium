import { ReactionBody, ReactionDTO } from '../dto'
import { ReactionRepository } from '../repository'
import { ReactionService } from '.'
import { FollowRepository } from '@domains/follow/repository'
import { UserRepository } from '@domains/user/repository'
import { PostRepository } from '@domains/post/repository'
import { NotFollow, NotFoundException } from '@utils'
import { reactionRouter } from '../controller'
import { error } from 'console'

export class ReactionServiceImpl implements ReactionService {

    constructor(private readonly repository: ReactionRepository,
        private readonly postRepository: PostRepository,
        private readonly followRepository: FollowRepository,
        private readonly userRepository: UserRepository) { }


    //Metodo para consigna 6
    async createReaction(userId: string, postId: string, data: ReactionBody): Promise<ReactionDTO> {

        const post = await this.postRepository.getById(postId);
        if (!post) throw new NotFoundException('post');

        const author = await this.userRepository.getById(post.authorId);
        const follow = await this.followRepository.following(userId, post.authorId);

        if (author?.isProfilePrivate && follow) {
            const reaction = await this.repository.createReaction(userId, postId, data);
            return reaction;
        } else if (!author?.isProfilePrivate) {
            const reaction = await this.repository.createReaction(userId, postId, data);
            return reaction;
        } else {
            throw new NotFollow();
        }

    }

    //Metodo para consigna 6
    async deleteReaction(userId: string, postId: string, data: ReactionBody): Promise<void> {

        const post = await this.postRepository.getById(postId);
        if (!post) throw new NotFoundException('post');

        const reaction = await this.repository.findReaction(userId, postId, data);
        if (!reaction) throw new NotFoundException('reaction');

        return await this.repository.delete(reaction.id);

    }

    //Metodo para consigna 8
    async getRetweets(userId: string): Promise<ReactionDTO[]> {

        const reactions = await this.repository.findAllRetweets(userId);

        if (reactions.length === 0) {
            throw new Error('El usuario aun no realizo retweets');
        }

        return reactions.map((reaction) => new ReactionDTO(reaction));

    }

    //Metodo para consigna 8
    async getLikes(userId: string): Promise<ReactionDTO[]> {

        const reactions = await this.repository.findAllLikes(userId);

        if (reactions.length === 0) {
            throw new Error('El usuario aun no dio likes');
        }

        return reactions.map((reaction) => new ReactionDTO(reaction));

    }
}
