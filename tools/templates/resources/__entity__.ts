import { Types } from 'mongoose';
import { AppError, ErrorCode, ErrorMessage, ErrorType } from '../../core/AppError';
import { Entity, EntityOrId } from '../../core/entity';
import { ResolveResult } from '../../core/resolve';
import { isObject } from '../../core/utils';

interface __entity__Props extends Record<string, any> {
  // valueObject: ValueObject;
  // entityRef: EntityOrId<Entity>;
}

export class __entity__ extends Entity<__entity__Props> {
  public toJson(): any {
    return {
      _id: this.id,
      // valueObject: this.props.valueObject.value,
      // entityRef: this.props.entityRef,
    };
  }
  public update(updateQuery: any): Error | null {
    // if (updateQuery.valueObject) {
    //   const [valueObject, error] = ValueObject.create(updateQuery.valueObject);
    //   if (error) {
    //     return error;
    //   } else {
    //     this.props.valueObject = valueObject!;
    //   }
    // }
    // if (updateQuery.entityRef) {
    //   try {
    //     const entityRef = Types.ObjectId(updateQuery.entityRef);
    //     this.props.entityRef = entityRef.toHexString();
    //   } catch (error) {
    //     return new AppError(
    //       ErrorMessage.InvalidField('entityRef'),
    //       ErrorType.USER,
    //       ErrorCode.VALIDATION_ERROR,
    //       400
    //     );
    //   }
    // }
    return null;
  }

  private constructor(props: __entity__Props, id?: string) {
    super(props, id);
  }

  public static create(json: any): ResolveResult<__entity__> {
    // const [valueObject, valueObjectError] = ValueObject.create(json.valueObject);
    // if (valueObjectError) {
    //   return [null, valueObjectError];
    // }

    // const [entityRef, entityRefError] = isObject(
    //   json.entityRef
    // )
    //   ? Entity.create(json.entityRef)
    //   : [json.entityRef, null];
    // if (entityRefError) {
    //   return [null, entityRefError];
    // }

    return [
      new __entity__(
        {
          // valueObject: valueObject!,
          // entityRef,
        },
        json._id
      ),
      null,
    ];
  }
}
