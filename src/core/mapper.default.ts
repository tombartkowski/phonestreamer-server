import { Model, Document } from 'mongoose';
import { Entity } from './entity';
import { Result } from './resolve';
import { Mapper } from './mapper';
import { AnyDocument } from './mapper';

const defaultMapper = <T extends Entity<any>>(
  factory: (json: any) => Result<T>,
  model: Model<T>
): Mapper<T> => {
  return {
    toDocument: (entity: T): Document<T> => {
      return new model(entity.toJson());
    },
    toEntity: (document: AnyDocument<T>): T => {
      const [entity, error] = factory(document);
      if (entity) {
        return entity;
      } else if (error) {
        throw error;
      } else {
        throw new Error('INVALID_STATE');
      }
    },
  };
};

export default defaultMapper;
