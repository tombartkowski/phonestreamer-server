import { Mapper } from '../../core/mapper';
import defaultRepository from '../../core/repository.default';
import { Repository } from '../../core/repository';
import { Session } from './session';
import SessionModel from './sessionModel';

const sessionRepository = (sessionMapper: Mapper<Session>): Repository<Session> => {
  return defaultRepository(SessionModel, sessionMapper);
};

export default sessionRepository;
