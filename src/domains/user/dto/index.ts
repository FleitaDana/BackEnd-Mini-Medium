export class UserDTO {
  constructor (user: UserDTO) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.createdAt = user.createdAt
    this.isProfilePrivate = user.isProfilePrivate // Agregamos el atributo isProfilePrivate
  }

  id: string
  name: string | null
  username: string
  createdAt: Date
  isProfilePrivate: boolean
}

export class ExtendedUserDTO extends UserDTO {
  email!: string;
  password!: string;
  //isProfilePrivate!: boolean; 

  constructor(user: ExtendedUserDTO) {
    super(user);
    this.email = user.email;
    this.password = user.password;
    //this.isProfilePrivate = user.isProfilePrivate || false; // Asignamos el valor del atributo isProfilePrivate
  }
}


