import defaultMapper from '../../core/mapper.default';
import { Mapper } from '../../core/mapper';
import { __entity__ } from './__entity__(camelCase)';
import __entity__Model from './__entity__(camelCase)Model';

const __entity__(camelCase)Mapper = (): Mapper<__entity__> =>
  defaultMapper(__entity__.create, __entity__Model);

export default __entity__(camelCase)Mapper;