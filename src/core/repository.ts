import { Result } from './resolve';
import { QueryOptions } from 'mongoose-query-parser';
import { RequestInput } from './controller';

export interface Repository<T> {
  find(query?: QueryOptions): Promise<Result<T[]>>;
  findById(id: string, query?: QueryOptions): Promise<Result<T | null>>;
  findOne(query: QueryOptions): Promise<Result<T | null>>;
  save(entity: T): Promise<Result<T | null>>;
  updateOne(
    id: string,
    update: any,
    query?: QueryOptions
  ): Promise<Result<T | null>>;
  delete(id: string): Promise<Result<T | null>>;
}
