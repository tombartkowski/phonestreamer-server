import { EnforceDocument, LeanDocument, Model, Query } from 'mongoose';
import { Mapper, AnyDocument } from './mapper';
import resolve from './resolve';
import { QueryOptions } from 'mongoose-query-parser';
import { Repository } from './repository';
import { Entity } from './entity';

type Documents<T> = LeanDocument<EnforceDocument<T, {}>>[];
type FetchQuery<T> = Query<
  EnforceDocument<T, {}> | null,
  EnforceDocument<T, {}>,
  {}
>;

type FetchListQuery<T> = Query<EnforceDocument<T, {}>[], EnforceDocument<T, {}>, {}>;

const defaultRepository = <T extends Entity<any>>(
  model: Model<T>,
  mapper: Mapper<T>
): Repository<T> => {
  const applyQuery = (fetchQuery: FetchQuery<T>, query?: QueryOptions) => {
    return fetchQuery.populate(query?.populate);
  };
  const applyQueryArray = (fetchQuery: FetchListQuery<T>, query?: QueryOptions) => {
    if (query?.sort) fetchQuery = fetchQuery.sort(query.sort);
    if (query?.skip) fetchQuery = fetchQuery.skip(query.skip);
    if (query?.limit) fetchQuery = fetchQuery.limit(query.limit);
    if (query?.populate) fetchQuery = fetchQuery.populate(query.populate);
    return fetchQuery;
  };

  const documentToEntity = (document: AnyDocument<T> | null) =>
    document ? mapper.toEntity(document) : null;

  const documentsToEntities = (documents: Documents<T>) =>
    documents.map(document => mapper.toEntity(document));

  return {
    findById: async (id: string, query?: QueryOptions) =>
      resolve(applyQuery(model.findById(id), query).lean().then(documentToEntity)),
    findOne: async (query: QueryOptions) => {
      console.log(query.filter);
      return resolve(
        applyQuery(model.findOne(query.filter), query).lean().then(documentToEntity)
      );
    },
    save: async (entity: T) =>
      resolve(mapper.toDocument(entity).save().then(documentToEntity)),
    find: async (query?: QueryOptions) =>
      resolve(
        applyQueryArray(model.find(query?.filter || {}), query)
          .lean()
          .then(documentsToEntities)
      ),
    delete: async (id: string) =>
      resolve(applyQuery(model.findByIdAndDelete(id)).lean().then(documentToEntity)),
    updateOne: async (id: string, update: any, query?: QueryOptions) =>
      resolve(
        applyQuery(model.findById(id), query)
          .then(document => {
            if (!document) {
              return null;
            }
            const entity = documentToEntity(document);
            if (!entity) return null;
            const error = entity.update(update);
            if (error) return Promise.reject(error);
            document.set(entity.toJson());
            return document.save();
          })
          .then(documentToEntity)
      ),
  };
};

export default defaultRepository;
