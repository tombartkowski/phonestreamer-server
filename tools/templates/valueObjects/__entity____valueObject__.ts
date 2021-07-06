import { ValueObject } from '../../../core/valueObject';
import { ResolveResult } from '../../../core/resolve';
import {
  AppError,
  ErrorCode,
  ErrorMessage,
  ErrorType,
} from '../../../core/AppError';

interface __valueObject__Props {
  // key: type;
}

export class __valueObject__ extends ValueObject<__valueObject__Props> {
  // get key(): type {
  //   return this.props.key;
  // }

  private constructor(props: __valueObject__Props) {
    super(props);
  }

  public static create(json: any): ResolveResult<__valueObject__> {
    // if (isValid(json)) {
    //   return [new __valueObject__({ key: json }), null];
    // } else {
    //   return [
    //     null,
    //     new AppError(
    //       ErrorMessage.InvalidOrMissingField('key'),
    //       ErrorType.USER,
    //       ErrorCode.VALIDATION_ERROR,
    //       400
    //     ),
    //   ];
    // }
    return [null, null];
  }

  public toDto(): any {
    return {
      // dtoKey: this.props.key,
    };
  }
}
