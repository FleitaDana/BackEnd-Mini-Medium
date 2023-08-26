import {FollowDTO } from '../dto'

export interface FollowService {

    //Metodos para consigna 1
    createFollow(followerId: string, followedId: string): Promise<FollowDTO>;
    deleteFollow(followerId: string, followedId: string): Promise<void>;
  }