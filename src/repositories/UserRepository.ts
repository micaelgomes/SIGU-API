import { EntityRepository, Repository } from 'typeorm';

import User from '../models/User';

@EntityRepository(User)
class AppointmentsRepository extends Repository<User> {}

export default AppointmentsRepository;
