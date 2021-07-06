import isMongoId from 'validator/lib/isMongoId';
import { AppError, ErrorCode, ErrorMessage, ErrorType } from '../../core/AppError';
import { Entity, EntityOrId } from '../../core/entity';
import { Result } from '../../core/resolve';
import { isObject } from '../../core/utils';
import { Device } from '../devices/device';
import { VirtualMachine } from '../virtualMachines/virtualMachine';
import { SimulatorIdentifier } from './valueObjects/simulatorIdentifier';

interface SimulatorProps extends Record<string, any> {
  identifier: SimulatorIdentifier;
  device: EntityOrId<Device>;
  virtualMachine: EntityOrId<VirtualMachine>;
}

export class Simulator extends Entity<SimulatorProps> {
  get identifier(): string {
    return this.props.identifier.value;
  }

  get device(): EntityOrId<Device> {
    return this.props.device;
  }

  get virtualMachine(): EntityOrId<VirtualMachine> {
    return this.props.virtualMachine;
  }

  public toJson(): any {
    return {
      _id: this.id,
      identifier: this.props.identifier.value,
      virtualMachine: this.props.virtualMachine,
      device: this.props.device,
    };
  }
  public update(_updateQuery: any): Error | null {
    return null;
  }

  private constructor(props: SimulatorProps, id?: string) {
    super(props, id);
  }

  public static create(json: any): Result<Simulator> {
    const [identifier, identifierError] = SimulatorIdentifier.create(
      json.identifier
    );
    if (identifierError) {
      return [null, identifierError];
    }

    if (
      json.device === undefined ||
      !(isObject(json.device) || isMongoId(json.device + ''))
    ) {
      return [
        null,
        new AppError(
          ErrorMessage.InvalidOrMissingField('device'),
          ErrorType.USER,
          ErrorCode.VALIDATION_ERROR,
          400
        ),
      ];
    }

    const [device, deviceError] = isObject(json.device)
      ? Device.create(json.device)
      : [json.device, null];
    if (deviceError) {
      return [null, deviceError];
    }

    if (
      json.virtualMachine === undefined ||
      !(isObject(json.virtualMachine) || isMongoId(json.virtualMachine + ''))
    ) {
      return [
        null,
        new AppError(
          ErrorMessage.InvalidOrMissingField('virtualMachine'),
          ErrorType.USER,
          ErrorCode.VALIDATION_ERROR,
          400
        ),
      ];
    }

    const [virtualMachine, virtualMachineError] = isObject(json.virtualMachine)
      ? VirtualMachine.create(json.virtualMachine)
      : [json.virtualMachine, null];
    if (virtualMachineError) {
      return [null, virtualMachineError];
    }

    return [
      new Simulator(
        {
          identifier: identifier!,
          device: device!,
          virtualMachine: virtualMachine!,
        },
        json._id
      ),
      null,
    ];
  }
}
