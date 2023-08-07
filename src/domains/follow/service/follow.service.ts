import {FollowDTO } from '../dto'

export interface FollowService {
    createFollow(followerId: string, followedId: string): Promise<FollowDTO>;
    deleteFollow(followerId: string, followedId: string): Promise<void>;
  }