import defaultMapper from '../../core/mapper.default';
import { Mapper } from '../../core/mapper';
import { App } from './app';
import AppModel from './appModel';

const appMapper = (): Mapper<App> =>
  defaultMapper(App.create, AppModel);

export default appMapper;