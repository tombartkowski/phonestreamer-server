import { Repository } from '../../core/repository';
import { ResolveResult } from '../../core/resolve';
import { __entity__ } from './__entity__(camelCase)';
import { QueryOptions } from 'mongoose-query-parser';

export interface __entity__Service {
  create__entity__: (body: any) => Promise<ResolveResult<__entity__>>;
  find__entity__s: (query: QueryOptions) => Promise<ResolveResult<__entity__[]>>;
  find__entity__ById: (
    id: string,
    query: QueryOptions
  ) => Promise<ResolveResult<__entity__>>;
  delete__entity__: (id: string) => Promise<ResolveResult<__entity__>>;
  patch__entity__: (id: string, body: any) => Promise<ResolveResult<__entity__>>;
}

export default (__entity__(camelCase)Repository: Repository<__entity__>): __entity__Service => {
  return {
    create__entity__: async (body: any) => {
      const [__entity__(camelCase), error] = __entity__.create(body);
      return __entity__(camelCase) !== null ? __entity__(camelCase)Repository.save(__entity__(camelCase)) : [null, error];
    },
    find__entity__s: async (query: QueryOptions) => __entity__(camelCase)Repository.find(query),
    find__entity__ById: async (id: string, query: QueryOptions) =>
      __entity__(camelCase)Repository.findById(id, query),
    delete__entity__: async (id: string) => __entity__(camelCase)Repository.delete(id),
    patch__entity__: async (id: string, body: any) =>
      __entity__(camelCase)Repository.updateOne(id, body),
  };
};
