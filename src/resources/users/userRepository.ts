import { Mapper } from '../../core/mapper';
import defaultRepository from '../../core/repository.default';
import { Repository } from '../../core/repository';
import { User } from './user';
import UserModel from './userModel';

const userRepository = (
  userMapper: Mapper<User>
): Repository<User> => {
  return defaultRepository(UserModel, userMapper);
};

export default userRepository;