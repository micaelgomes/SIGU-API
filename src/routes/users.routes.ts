import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import CreateUserService from '../services/CreateUserService';
import UserRepository from '../repositories/UserRepository';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

/**
 * To list all Users
 */
usersRouter.get('/', ensureAuthenticated, async (request, response) => {
  const userRepository = getCustomRepository(UserRepository);
  const users = await userRepository.find();

  return response.json(users);
});

/**
 * To create new User
 */
usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const createUserService = new CreateUserService();
  const user = await createUserService.execute({ name, email, password });

  return response.status(201).json(user);
});

/**
 * To delete User
 */
usersRouter.delete('/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;
  const userRepository = getCustomRepository(UserRepository);

  await userRepository.delete(id);

  return response.status(201).json({ message: 'success' });
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      userId: req.user.id,
      avatarFilename: req.file.filename,
    });

    return res.status(201).json(user);
  },
);

export default usersRouter;
