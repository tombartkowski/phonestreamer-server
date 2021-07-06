import { ValueObject } from '../../../core/valueObject';
import { Result } from '../../../core/resolve';
import { Url, UrlProps } from '../../../common/url';

export class PreviewImageUrl extends ValueObject<UrlProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UrlProps) {
    super(props);
  }

  public static create(json: any): Result<PreviewImageUrl> {
    const [url, error] = Url.create(json, 'previewImageUrl');
    if (error) {
      return [null, error];
    }
    return [new PreviewImageUrl({ value: url!.value }), null];
  }

  public toDto(): any {
    return {
      previewImageUrl: this.props.value,
    };
  }
}
