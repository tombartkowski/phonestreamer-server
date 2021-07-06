import { Entity } from '../../core/entity';
import { Result } from '../../core/resolve';
import { DeviceModel } from './valueObjects/deviceModel';
import { PreviewImageUrl } from './valueObjects/devicePreviewImageUrl';

interface DeviceProps extends Record<string, any> {
  model: DeviceModel;
  previewImageUrl: PreviewImageUrl;
}

export class Device extends Entity<DeviceProps> {
  get modelName() {
    return this.props.model.modelName;
  }
  get operatingSystemType() {
    return this.props.model.operatingSystemType;
  }
  get operatingSystemVersionNumber() {
    return this.props.model.operatingSystemVersionNumber;
  }
  get typeIdentifier() {
    return this.props.model.typeIdentifier;
  }
  get previewImageUrl() {
    return this.props.previewImageUrl.value;
  }

  public toJson(): any {
    return {
      _id: this.id,
      modelName: this.props.model.modelName,
      operatingSystemType: this.props.model.operatingSystemType,
      operatingSystemVersionNumber: this.props.model.operatingSystemVersionNumber,
      typeIdentifier: this.props.model.typeIdentifier,
      previewImageUrl: this.props.previewImageUrl.value,
    };
  }

  public update(updateQuery: any) {
    let error: Error | null = null;
    const [value, urlError] = PreviewImageUrl.create(updateQuery.previewImageUrl);
    error = urlError;
    if (error === null) {
      this.props.previewImageUrl = value!;
    }
    return error;
  }

  private constructor(props: DeviceProps, id?: string) {
    super(props, id);
  }

  public static create(json: any): Result<Device> {
    const [model, modelError] = DeviceModel.create(json.typeIdentifier);
    if (modelError) return [null, modelError];

    const [previewImageUrl, previewImageUrlError] = PreviewImageUrl.create(
      json.previewImageUrl
    );
    if (previewImageUrlError) return [null, previewImageUrlError];

    return [
      new Device(
        {
          model: model!,
          previewImageUrl: previewImageUrl!,
        },
        json._id
      ),
      null,
    ];
  }
}
