import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';
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
      throw new AppError('User email/password incorrect!', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('User email/password incorrect!', 401);
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
