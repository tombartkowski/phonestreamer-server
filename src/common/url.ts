import { ValueObject } from '../core/valueObject';
import { Result } from '../core/resolve';
import { AppError, ErrorCode, ErrorMessage, ErrorType } from '../core/AppError';
import isURL from 'validator/lib/isURL';

export interface UrlProps {
  value: string;
}

export class Url extends ValueObject<UrlProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UrlProps) {
    super(props);
  }

  public static create(
    url: any,
    fieldName: string,
    requireTld: boolean = true
  ): Result<Url> {
    const stringUrl = url + '';
    if (
      isURL(stringUrl, {
        allow_protocol_relative_urls: true,
        require_tld: requireTld,
      })
    ) {
      return [new Url({ value: url }), null];
    } else {
      return [
        null,
        new AppError(
          ErrorMessage.InvalidOrMissingField(fieldName),
          ErrorType.USER,
          ErrorCode.VALIDATION_ERROR,
          400
        ),
      ];
    }
  }

  public toDto(): any {
    return {
      value: this.props.value,
    };
  }
}
