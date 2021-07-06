import { Entity } from '../../core/entity';
import { Result } from '../../core/resolve';

interface UserProps extends Record<string, any> {
  firebaseId: string;
  email: string;
  signupMethod: string;
}

export class User extends Entity<UserProps> {
  public toJson(): any {
    return {
      _id: this.id,
      firebaseId: this.props.firebaseId,
      email: this.props.email,
      signupMethod: this.props.signupMethod,
    };
  }
  public update(_updateQuery: any): Error | null {
    return null;
  }

  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public static create(json: any): Result<User> {
    return [
      new User(
        {
          firebaseId: json.firebaseId,
          email: json.email,
          signupMethod: json.method,
        },
        json._id
      ),
      null,
    ];
  }
}
