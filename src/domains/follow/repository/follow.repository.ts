import {FollowDTO } from '../dto'

export interface FollowRepository {
    createFollow(followerId: string, followedId: string): Promise<FollowDTO>;
    unfollowUser(followerId: string, followedId: string): Promise<void>;

    //Metodo para consigna 2
    getFollowedUsers(userId : string) : Promise<string[]>;
  }