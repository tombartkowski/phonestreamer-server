import { AppError, ErrorCode, ErrorMessage, ErrorType } from '../../core/AppError';
import { Entity, EntityOrId } from '../../core/entity';
import { Result } from '../../core/resolve';
import { nanoid } from 'nanoid';
import isURL from 'validator/lib/isURL';
import { User } from '../users/user';
import { isObject } from './../../core/utils';
import isMongoId from 'validator/lib/isMongoId';
interface AppProps extends Record<string, any> {
  shortId: string;
  name: string;
  user: EntityOrId<User>;
  altName: string;
  bundleIdentifier: string;
  version: string;
  buildNumber: string;
  iconUrl: string;
  bundleUrl: string;
  supportedDevices: number[];
}

export class App extends Entity<AppProps> {
  public toJson(): any {
    return {
      _id: this.id,
      shortId: this.props.shortId,
      name: this.props.name,
      altName: this.props.altName,
      bundleIdentifier: this.props.bundleIdentifier,
      iconUrl: this.props.iconUrl,
      version: this.props.version,
      user: this.props.user,
      buildNumber: this.props.buildNumber,
      bundleUrl: this.props.bundleUrl,
      supportedDevices: this.props.supportedDevices,
    };
  }
  public update(_updateQuery: any): Error | null {
    return null;
  }

  private constructor(props: AppProps, id?: string) {
    super(props, id);
  }

  public static create(json: any): Result<App> {
    const [user, userError] = isObject(json.user)
      ? User.create(json.user)
      : [json.user, null];
    if (userError) {
      return [null, userError];
    }

    if (!json.name) {
      return Result.error(
        new AppError(
          ErrorMessage.InvalidOrMissingField('name'),
          ErrorType.INTERNAL,
          ErrorCode.VALIDATION_ERROR,
          400
        )
      );
    }

    if (!json.altName) {
      return Result.error(
        new AppError(
          ErrorMessage.InvalidOrMissingField('altName'),
          ErrorType.INTERNAL,
          ErrorCode.VALIDATION_ERROR,
          400
        )
      );
    }

    if (!json.bundleIdentifier) {
      return Result.error(
        new AppError(
          ErrorMessage.InvalidOrMissingField('bundleIdentifier'),
          ErrorType.INTERNAL,
          ErrorCode.VALIDATION_ERROR,
          400
        )
      );
    }

    if (!json.version) {
      return Result.error(
        new AppError(
          ErrorMessage.InvalidOrMissingField('version'),
          ErrorType.INTERNAL,
          ErrorCode.VALIDATION_ERROR,
          400
        )
      );
    }

    if (!json.buildNumber) {
      return Result.error(
        new AppError(
          ErrorMessage.InvalidOrMissingField('buildNumber'),
          ErrorType.INTERNAL,
          ErrorCode.VALIDATION_ERROR,
          400
        )
      );
    }

    if (!json.supportedDevices) {
      return Result.error(
        new AppError(
          ErrorMessage.InvalidOrMissingField('supportedDevices'),
          ErrorType.INTERNAL,
          ErrorCode.VALIDATION_ERROR,
          400
        )
      );
    }

    if (!json.iconUrl || !isURL(json.iconUrl + '')) {
      return Result.error(
        new AppError(
          ErrorMessage.InvalidOrMissingField('iconUrl'),
          ErrorType.INTERNAL,
          ErrorCode.VALIDATION_ERROR,
          400
        )
      );
    }

    if (!json.bundleUrl || !isURL(json.bundleUrl + '')) {
      return Result.error(
        new AppError(
          ErrorMessage.InvalidOrMissingField('bundleUrl'),
          ErrorType.INTERNAL,
          ErrorCode.VALIDATION_ERROR,
          400
        )
      );
    }

    return [
      new App(
        {
          name: json.name,
          altName: json.altName,
          user: user!,
          bundleIdentifier: json.bundleIdentifier,
          version: json.version,
          buildNumber: json.buildNumber,
          supportedDevices: json.supportedDevices,
          iconUrl: json.iconUrl,
          bundleUrl: json.bundleUrl,
          shortId: json.shortId || nanoid(10),
        },
        json._id
      ),
      null,
    ];
  }
}
