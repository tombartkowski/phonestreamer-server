import { ValueObject } from '../../../core/valueObject';
import { Result } from '../../../core/resolve';
import { Url } from '../../../common/url';

interface RemoteUrlProps {
  value: string;
}

export class RemoteUrl extends ValueObject<RemoteUrlProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: RemoteUrlProps) {
    super(props);
  }

  public static create(json: any): Result<RemoteUrl> {
    const [url, error] = Url.create(json, 'remoteUrl', false);
    if (error) {
      return [null, error];
    }
    return [new RemoteUrl({ value: url!.value }), null];
  }

  public toDto(): any {
    return {
      remoteUrl: this.props.value,
    };
  }
}
