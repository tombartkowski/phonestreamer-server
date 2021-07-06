import { AppError, ErrorCode, ErrorMessage, ErrorType } from '../../core/AppError';
import { Entity } from '../../core/entity';
import { Result } from '../../core/resolve';
import { RemoteUrl } from './valueObjects/virtualMachineRemoteUrl';

interface VirtualMachineProps extends Record<string, any> {
  remoteUrl: RemoteUrl;
}

export class VirtualMachine extends Entity<VirtualMachineProps> {
  get remoteUrl(): string {
    return this.props.remoteUrl.value;
  }

  public toJson(): any {
    return {
      _id: this.id,
      remoteUrl: this.props.remoteUrl.value,
    };
  }

  public update(updateQuery: any): Error | null {
    let error: Error | null = null;
    const [remoteUrl, remoteUrlError] = RemoteUrl.create(updateQuery.remoteUrl);
    error = remoteUrlError;
    if (error === null) {
      this.props.remoteUrl = remoteUrl!;
    }
    return error;
  }

  private constructor(props: VirtualMachineProps, id?: string) {
    super(props, id);
  }

  public static create(json: any): Result<VirtualMachine> {
    if (!json.remoteUrl) {
      return [
        null,
        new AppError(
          ErrorMessage.InvalidOrMissingField('remoteUrl'),
          ErrorType.USER,
          ErrorCode.VALIDATION_ERROR,
          400
        ),
      ];
    }

    const [remoteUrl, remoteUrlError] = RemoteUrl.create(json.remoteUrl);
    if (remoteUrlError) {
      return [null, remoteUrlError];
    }

    return [
      new VirtualMachine(
        {
          remoteUrl: remoteUrl!,
        },
        json._id
      ),
      null,
    ];
  }
}
