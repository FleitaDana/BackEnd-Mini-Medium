export class UserDTO {
    constructor (user: UserDTO) {
      this.id = user.id
      this.firstName = user.firstName
      this.lastName = user.lastName
      this.email = user.email
      this.password = user.password 
    }
  
    id: string
    firstName: string 
    lastName: string
    email: string
    password: string
  }
  
  export class ExtendedUserDTO extends UserDTO {
    email: string;
    password: string;
  
    constructor(user: ExtendedUserDTO) {
      super(user);
      this.email = user.email;
      this.password = user.password;
      
    }
  }
  