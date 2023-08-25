import {ReactionBody, ReactionDTO } from '../dto'

export interface ReactionRepository {

    createReaction: (userId: string, postId: string, data: ReactionBody) => Promise<ReactionDTO>;


    findReaction: (userId: string, postId: string, data: ReactionBody) => Promise<ReactionDTO | null >;

    delete: (reactionId: string) => Promise<void>;
    

    //Consigna 8
    findAllRetweets: (userId: string) => Promise<ReactionDTO[]>; 
    findAllLikes: (userId: string) => Promise<ReactionDTO[]>; 

  }