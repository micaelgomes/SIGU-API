import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

import User from '../models/User';
import { UserDTO, UserMap } from '../mappers/UserMap';

interface RequestDTO {
  email: string;
  password: string;
}

interface ResponseDTO {
  user: UserDTO;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: RequestDTO): Promise<ResponseDTO> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('User email/password incorrect!');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('User email/password incorrect!');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    const userDTO = UserMap.toDTO(user);

    return {
      user: userDTO,
      token,
    };
  }
}

export default AuthenticateUserService;
