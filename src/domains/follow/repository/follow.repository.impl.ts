import { db } from '@utils';
import { PrismaClient } from '@prisma/client'
import { FollowDTO } from '../dto'
import { FollowRepository } from './follow.repository'

export class FollowRepositoryImpl implements FollowRepository {

    constructor(private readonly db: PrismaClient) { }

    async createFollow(followerId: string, followedId: string): Promise<FollowDTO> {

        /* const follower = await this.db.user.findUnique({ where: { id: followerId } });
        const followed = await this.db.user.findUnique({ where: { id: followedId } });
    
        if (!follower || !followed) {
            throw new Error('Follower or Followed user not found');
        } */

        /*    return await this.db.follow.create({
               data: {
                   followerId,
                   followedId,
               },
           }) */

        const follow = await this.db.follow.create({
            data: {
                followerId: followerId,
                followedId: followedId,
            },
        });

        return new FollowDTO(follow);
    }

    async unfollowUser(followerId: string, followedId: string): Promise<void> {

        const follow = await this.db.follow.findFirst({
            where: {
                followerId: { equals: followerId },
                followedId: { equals: followedId },
            },
        });

        if (follow) {
            await this.db.follow.delete({
                where: { id: follow.id },
            });
        } else {
            throw new Error('Follow relationship not found');
        }
    }


    //Metodo para la consigna 3
    async getFollowedUsers(userId: string): Promise<string[]> {
        // Obtenemos los IDs de los usuarios seguidos por el usuario con el ID proporcionado (userId)
        const followedUsers = await this.db.follow.findMany({
            where: {
                followerId: userId,
            },
            select: {
                followedId: true,
            },
        });

        // Mapeamos los IDs de usuarios seguidos en un arreglo de strings
        const followedUserIds = followedUsers.map((follow) => follow.followedId);

        console.log(followedUserIds)

        return followedUserIds;
    }

    //Metodo para la consigna 4
    async following(userId: string, authorId: string): Promise<boolean> {

        // Buscamos si existe una entrada en la tabla 'follow' donde el followerId coincide con userId y followedId coincide con authorId.
        const following = await this.db.follow.findFirst({
            where: {
                followerId: userId,
                followedId: authorId,
            },
        });

        // Si encontramos una entrada True, significa que el usuario sigue al autor.
        return Boolean(following);
    }
}



