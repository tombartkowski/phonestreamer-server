import { ValueObject } from '../../../core/valueObject';
import { Result } from '../../../core/resolve';
import {
  AppError,
  ErrorCode,
  ErrorMessage,
  ErrorType,
} from '../../../core/AppError';

export type DeviceModelType = {
  name: string;
  identifier: string;
  operatingSystemType: string;
  operatingSystemVersionNumber: string;
};

interface DeviceModelProps {
  modelName: string;
  operatingSystemType: string;
  operatingSystemVersionNumber: string;
  typeIdentifier: string;
}

export class DeviceModel extends ValueObject<DeviceModelProps> {
  private static readonly AvailableDeviceModels: DeviceModelType[] = [
    Object.freeze({
      name: 'iPhone 8',
      identifier: 'IPHONE_8',
      operatingSystemType: 'IOS',
      operatingSystemVersionNumber: '14.4',
    }),
    Object.freeze({
      name: 'iPhone 8 Plus',
      identifier: 'IPHONE_8_PLUS',
      operatingSystemType: 'IOS',
      operatingSystemVersionNumber: '14.4',
    }),
    Object.freeze({
      name: 'iPhone X',
      identifier: 'IPHONE_X',
      operatingSystemType: 'IOS',
      operatingSystemVersionNumber: '14.4',
    }),
  ];

  get modelName() {
    return this.props.modelName;
  }
  get operatingSystemType() {
    return this.props.operatingSystemType;
  }
  get operatingSystemVersionNumber() {
    return this.props.operatingSystemVersionNumber;
  }
  get typeIdentifier() {
    return this.props.typeIdentifier;
  }

  private constructor(props: DeviceModelProps) {
    super(props);
  }

  public static create(typeIdentifier: any): Result<DeviceModel> {
    const stringTypeIdentifier = (typeIdentifier + '').trim();
    const model = this.AvailableDeviceModels.find(
      model => model.identifier === stringTypeIdentifier
    );
    if (model) {
      return [
        new DeviceModel({
          modelName: model.name,
          operatingSystemType: model.operatingSystemType,
          operatingSystemVersionNumber: model.operatingSystemVersionNumber,
          typeIdentifier: typeIdentifier!,
        }),
        null,
      ];
    } else {
      return [
        null,
        new AppError(
          ErrorMessage.InvalidOrMissingField('typeIdentifier'),
          ErrorType.USER,
          ErrorCode.VALIDATION_ERROR,
          400
        ),
      ];
    }
  }

  public toDto(): any {
    return {
      modelName: this.props.modelName,
      operatingSystemType: this.props.operatingSystemType,
      operatingSystemVersionNumber: this.props.operatingSystemVersionNumber,
      typeIdentifier: this.props.typeIdentifier,
    };
  }
}
