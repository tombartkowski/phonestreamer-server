import { Mapper } from '../../core/mapper';
import defaultRepository from '../../core/repository.default';
import { Repository } from '../../core/repository';
import { App } from './app';
import AppModel from './appModel';

const appRepository = (
  appMapper: Mapper<App>
): Repository<App> => {
  return defaultRepository(AppModel, appMapper);
};

export default appRepository;