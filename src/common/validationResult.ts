import { ValueObject } from '../core/valueObject';
import { Result } from '../core/resolve';
import { AppError, ErrorCode, ErrorMessage, ErrorType } from '../core/AppError';
import { Entity } from '../core/entity';

export interface ValidationResultProps {
  isValid: boolean;
}

export class ValidationResult extends Entity<ValidationResultProps> {
  private constructor(props: ValidationResultProps) {
    super(props);
  }

  update() {
    return null;
  }

  public static create(isValid: boolean): ValidationResult {
    return new ValidationResult({ isValid });
  }

  public toJson(): any {
    return {
      isValid: this.props.isValid,
    };
  }
}
