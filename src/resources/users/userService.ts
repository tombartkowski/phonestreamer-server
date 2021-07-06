import { Repository } from '../../core/repository';
import { Result } from '../../core/resolve';
import { User } from './user';
import { MongooseQueryParser, QueryOptions } from 'mongoose-query-parser';
import { ValidationResult } from '../../common/validationResult';
import { AppError, ErrorMessage, ErrorCode, ErrorType } from '../../core/AppError';
import { memoryCache } from '../../infra/memoryCache';
import { RequestInput } from '../../core/controller';

export interface UserService {
  createUser: (body: any) => Promise<Result<User>>;
  checkEmailAvailability: (body: any) => Promise<Result<ValidationResult>>;
  findUsers: (input: RequestInput) => Promise<Result<User[]>>;
  findCurrentUser: (input: RequestInput) => Promise<Result<User>>;
  findUserById: (id: string, input: RequestInput) => Promise<Result<User>>;
  deleteUser: (id: string) => Promise<Result<User>>;
  patchUser: (id: string, body: any) => Promise<Result<User>>;
}

export default (userRepository: Repository<User>): UserService => {
  const parser = new MongooseQueryParser();
  return {
    createUser: async (body: any) => {
      const query = {
        filter: {
          $or: [{ email: body.email }, { firebaseId: body.firebaseId }],
        },
      };
      const [existingUser] = await userRepository.findOne(query);
      const signupMethod = body.method;
      const source = body.source;
      if (existingUser && (signupMethod === 'github' || source === 'signin')) {
        return [existingUser, null];
      } else if (existingUser) {
        return [
          null,
          new AppError(
            ErrorMessage.UserAlreadyExists,
            ErrorType.USER,
            ErrorCode.USER_ALREADY_EXISTS,
            400
          ),
        ];
      }

      const [user, error] = User.create(body);
      return user !== null ? userRepository.save(user) : [null, error];
    },
    checkEmailAvailability: async (body: any) => {
      const email = (body.email + '').trim().toLowerCase();
      const query = {
        filter: {
          email,
        },
        limit: 1,
        select: { _id: 0, email: 1 },
      };
      const [users, error] = await userRepository.find(query);
      if (error) {
        return [null, error];
      }
      const isValid = users?.length === 0;
      memoryCache.set(email, isValid, '60');
      return [ValidationResult.create(isValid), null];
    },
    findUsers: async (input: RequestInput) =>
      userRepository.find(parser.parse(input.query)),
    findUserById: async (id: string, input: RequestInput) =>
      userRepository.findById(id, parser.parse(input.query)),
    findCurrentUser: async (input: RequestInput) => {
      return userRepository.findById(input.params.userId, parser.parse(input.query));
    },
    deleteUser: async (id: string) => userRepository.delete(id),
    patchUser: async (id: string, body: any) => userRepository.updateOne(id, body),
  };
};
