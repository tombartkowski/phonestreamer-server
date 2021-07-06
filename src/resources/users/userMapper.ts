import defaultMapper from '../../core/mapper.default';
import { Mapper } from '../../core/mapper';
import { User } from './user';
import UserModel from './userModel';

const userMapper = (): Mapper<User> =>
  defaultMapper(User.create, UserModel);

export default userMapper;