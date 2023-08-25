import {ReactionBody, ReactionDTO } from '../dto'

export interface ReactionService {
    createReaction: (userId: string, postId: string, data: ReactionBody)=>Promise<ReactionDTO>;

    deleteReaction: (userId: string, postId: string, data: ReactionBody)=> Promise<void>;

    //Consigna 8
    getRetweets: (userId : string ) => Promise<ReactionDTO[]>;
    getLikes: (userId : string ) => Promise<ReactionDTO[]>;
  }