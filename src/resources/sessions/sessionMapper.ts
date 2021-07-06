import defaultMapper from '../../core/mapper.default';
import { Mapper } from '../../core/mapper';
import { Session } from './session';
import SessionModel from './sessionModel';

const sessionMapper = (): Mapper<Session> =>
  defaultMapper(Session.create, SessionModel);

export default sessionMapper;
