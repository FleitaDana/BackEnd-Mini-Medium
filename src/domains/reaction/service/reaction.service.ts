import {ReactionBody, ReactionDTO } from '../dto'

export interface ReactionService {

    //Metodos para consigna 6
    createReaction: (userId: string, postId: string, data: ReactionBody)=>Promise<ReactionDTO>;
    deleteReaction: (userId: string, postId: string, data: ReactionBody)=> Promise<void>;

    ////Metodos para consigna 8
    getRetweets: (userId : string ) => Promise<ReactionDTO[]>;
    getLikes: (userId : string ) => Promise<ReactionDTO[]>;
  }