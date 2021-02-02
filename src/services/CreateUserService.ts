import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import { UserMap, UserDTO } from '../mappers/UserMap';
import AppError from '../errors/AppError';

interface RequestDTO {
  id?: string;
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({
    id,
    name,
    email,
    password,
  }: RequestDTO): Promise<UserDTO> {
    const userRepository = getRepository(User);

    const userCurr = await userRepository.findOne({
      where: { id },
    });

    const hashedPassword = await hash(password, 8);

    if (!userCurr) {
      const checkEmailExist = await userRepository.findOne({
        where: { email },
      });

      if (checkEmailExist) throw new AppError('Email address already used.');

      const user = await userRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      await userRepository.save(user);

      const userToDTO = UserMap.toDTO(user);

      return userToDTO;
    }

    const userUpdated = await userRepository.save({
      id,
      name,
      email,
      password: hashedPassword,
    });

    const userToDTO = UserMap.toDTO(userUpdated);

    return userToDTO;
  }
}

export default CreateUserService;
