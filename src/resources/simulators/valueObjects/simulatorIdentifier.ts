import { ValueObject } from '../../../core/valueObject';
import { Result } from '../../../core/resolve';
import { nanoid } from 'nanoid';
import {
  AppError,
  ErrorCode,
  ErrorMessage,
  ErrorType,
} from '../../../core/AppError';

interface SimulatorIdentifierProps {
  value: string;
}

export class SimulatorIdentifier extends ValueObject<SimulatorIdentifierProps> {
  private static readonly IDENTIFIER_LENGTH = 6;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: SimulatorIdentifierProps) {
    super(props);
  }

  public static create(identifier?: any): Result<SimulatorIdentifier> {
    if (identifier) {
      const stringIdentifier = (identifier + '').trim();
      if (stringIdentifier.length === this.IDENTIFIER_LENGTH) {
        return [new SimulatorIdentifier({ value: stringIdentifier }), null];
      } else {
        return [
          null,
          new AppError(
            ErrorMessage.InvalidOrMissingField('identifier'),
            ErrorType.USER,
            ErrorCode.VALIDATION_ERROR,
            400
          ),
        ];
      }
    } else {
      return [
        new SimulatorIdentifier({ value: nanoid(this.IDENTIFIER_LENGTH) }),
        null,
      ];
    }
  }

  public toDto(): any {
    return {
      identifier: this.props.value,
    };
  }
}
