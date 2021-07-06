import { Mapper } from '../../core/mapper';
import defaultRepository from '../../core/repository.default';
import { Repository } from '../../core/repository';
import { __entity__ } from './__entity__(camelCase)';
import __entity__Model from './__entity__(camelCase)Model';

const __entity__(camelCase)Repository = (
  __entity__(camelCase)Mapper: Mapper<__entity__>
): Repository<__entity__> => {
  return defaultRepository(__entity__Model, __entity__(camelCase)Mapper);
};

export default __entity__(camelCase)Repository;