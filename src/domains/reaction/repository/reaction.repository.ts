import {ReactionBody, ReactionDTO } from '../dto'

export interface ReactionRepository {
  
    //Metodos para consigna 6
    createReaction: (userId: string, postId: string, data: ReactionBody) => Promise<ReactionDTO>;
    findReaction: (userId: string, postId: string, data: ReactionBody) => Promise<ReactionDTO | null >;
    delete: (reactionId: string) => Promise<void>;
    
    //Metodos para consigna 8
    findAllRetweets: (userId: string) => Promise<ReactionDTO[]>; 
    findAllLikes: (userId: string) => Promise<ReactionDTO[]>; 

  }