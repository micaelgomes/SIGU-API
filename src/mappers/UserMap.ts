import User from '../models/User';

export interface UserDTO {
  name: string;
  email: string;
  id: string;
  createAt: Date;
  updateAt: Date;
  avatar: string;
}

export class UserMap {
  public static toDTO(user: User): UserDTO {
    const userToDTO = {
      name: user.name,
      email: user.email,
      id: user.id,
      createAt: user.createAt,
      updateAt: user.updateAt,
      avatar: user.avatar,
    };

    return userToDTO;
  }
}
