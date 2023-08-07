import { FollowDTO } from '../dto'
import { FollowRepository } from '../repository'
import { FollowService } from '.'

export class FollowServiceImpl implements FollowService {

    constructor(private readonly repository: FollowRepository) { }

    async createFollow(followerId: string, followedId: string): Promise<FollowDTO> {
        return await this.repository.createFollow(followerId, followedId)
    }

    async deleteFollow(followerId: string, followedId: string): Promise<void> {
        await this.repository.unfollowUser(followerId, followedId)
    }

}
