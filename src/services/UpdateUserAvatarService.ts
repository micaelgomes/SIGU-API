import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import uploadConfig from '../config/upload';
import { UserMap, UserDTO } from '../mappers/UserMap';
import AppError from '../errors/AppError';

interface RequestDTO {
  userId: string;
  avatarFilename: string;
}

export default class UpdateUserAvatarService {
  public async execute({
    userId,
    avatarFilename,
  }: RequestDTO): Promise<UserDTO> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(userId);

    if (!user)
      throw new AppError('Only authenticated user can update Avatar!', 401);

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;
    await userRepository.save(user);
    const userDTO = UserMap.toDTO(user);

    return userDTO;
  }
}
