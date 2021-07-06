import { Types } from 'mongoose';
import { keys, values } from './utils';
import { ValueObject } from './valueObject';

export type EntityOrId<T> = Entity<T> | Types.ObjectId;

export abstract class Entity<T extends Record<string, any>> {
  id?: Types.ObjectId | string;
  protected props: T;
  constructor(props: T, id?: string) {
    this.id = id;
    this.props = props;
  }
  private nextObjectForKey = (currentObject: any, key: string): any => {
    //TODO: Very inefficient. Fix performance.
    const selfKeys = keys(this.props);
    let unwrappedSelf: Record<string, any> = {};
    selfKeys.forEach(key => {
      const value = this.props[key];
      if (value instanceof Entity) {
        unwrappedSelf[key] = value.toDto();
      } else if (value instanceof ValueObject) {
        const valueObject = value.toDto();
        Object.entries(valueObject).forEach(entry => {
          unwrappedSelf[entry[0]] = entry[1];
        });
      } else {
        unwrappedSelf[key] = value;
      }
    });

    const value = unwrappedSelf[key];
    if (value instanceof Entity) {
      return { ...currentObject, [key]: value.toDto() };
    } else if (value instanceof ValueObject) {
      return Object.entries(value.toDto()).reduce(
        (obj, entry) => ({ ...obj, [entry[0]]: entry[1] }),
        currentObject
      );
    } else {
      if (value instanceof Types.ObjectId) {
        return { ...currentObject, [key]: value.toHexString() };
      }
      return { ...currentObject, [key]: value };
    }
  };

  public toDto(selection?: any) {
    const { _id, ...selectQuery } = selection || {};

    const propsKeys = keys(this.props);
    const selfKeys: string[] = [];
    propsKeys.forEach(key => {
      const value = this.props[key];
      if (value instanceof Entity) {
        selfKeys.push(key);
      } else if (value instanceof ValueObject) {
        const valueObject = value.toDto();
        keys(valueObject).forEach(key => {
          selfKeys.push(key);
        });
      } else {
        selfKeys.push(key);
      }
    });

    const selectedKeys =
      keys(selectQuery).length !== 0
        ? values(selectQuery).every(el => el)
          ? keys(selectQuery)
          : selfKeys.filter(key => !keys(selectQuery).includes(key))
        : selfKeys;

    if (this.id instanceof Types.ObjectId) {
      const temp = this.id as unknown;
      this.id = (temp as Types.ObjectId).toHexString();
    }
    return {
      ...selectedKeys.reduce(this.nextObjectForKey, <any>{}),
      id: _id !== undefined && _id === 0 ? undefined : this.id,
    };
  }

  abstract toJson(): any;
  abstract update(updateQuery: any): Error | null;
}
