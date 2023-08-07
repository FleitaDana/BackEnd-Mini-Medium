export class FollowDTO {
    constructor (follow : FollowDTO) {
      this.id = follow.id
      this.followerId = follow.followerId
      this.followedId = follow.followedId
      this.createdAt = follow.createdAt
      this.updatedAt = follow.updatedAt
      this.deletedAt = follow.deletedAt
    }
  
  id: String  
  followerId: String    
  followedId: String    
  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
  
  }