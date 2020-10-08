import { Router } from 'express';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

/**
 * To create new Appointment
 */
usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const createUserService = new CreateUserService();
    const user = await createUserService.execute({ name, email, password });

    return response.status(201).json(user);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

usersRouter.patch('/avatar', ensureAuthenticated, async (req, res) => {
  return res.json({ ok: true });
});

export default usersRouter;
