import { Document, EnforceDocument, LeanDocument } from 'mongoose';

export type AnyDocument<T> =
  | Document<T>
  | LeanDocument<Document<T>>
  | LeanDocument<EnforceDocument<T, {}>>;

export interface Mapper<T> {
  toDocument: (rawJson: T) => Document<T>;
  toEntity: (document: AnyDocument<T>) => T;
}
