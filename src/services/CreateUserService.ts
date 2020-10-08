import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import { UserMap, UserDTO } from '../mappers/UserMap';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({
    name,
    email,
    password,
  }: RequestDTO): Promise<UserDTO> {
    const userRepository = getRepository(User);

    const checkUserExists = await userRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new Error('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);
    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);

    const userToDTO = UserMap.toDTO(user);

    return userToDTO;
  }
}

export default CreateUserService;
