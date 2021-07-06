import isMongoId from 'validator/lib/isMongoId';
import { AppError, ErrorCode, ErrorMessage, ErrorType } from '../../core/AppError';
import { Entity, EntityOrId } from '../../core/entity';
import { Result } from '../../core/resolve';
import { isObject } from '../../core/utils';
import { Device } from '../devices/device';
import { Simulator } from '../simulators/simulator';
import { VirtualMachine } from '../virtualMachines/virtualMachine';

interface SessionProps extends Record<string, any> {
  startedOn: Date;
  device: EntityOrId<Device>;
  virtualMachine: EntityOrId<VirtualMachine>;
  simulator: EntityOrId<Simulator>;
}

export class Session extends Entity<SessionProps> {
  get startedOn(): Date {
    return this.props.startedOn;
  }

  get device(): EntityOrId<Device> {
    return this.props.device;
  }

  get virtualMachine(): EntityOrId<VirtualMachine> {
    return this.props.virtualMachine;
  }

  get simulator(): EntityOrId<Simulator> {
    return this.props.simulator;
  }

  public toJson(): any {
    return {
      _id: this.id,
      startedOn: this.props.startedOn,
      device: this.props.device,
      virtualMachine: this.props.virtualMachine,
      simulator: this.props.simulator,
    };
  }
  public update(_updateQuery: any): Error | null {
    return null;
  }

  private constructor(props: SessionProps, id?: string) {
    super(props, id);
  }

  public static create(json: any): Result<Session> {
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

    if (
      json.simulator === undefined ||
      !(isObject(json.simulator) || isMongoId(json.simulator + ''))
    ) {
      return [
        null,
        new AppError(
          ErrorMessage.InvalidOrMissingField('simulator'),
          ErrorType.USER,
          ErrorCode.VALIDATION_ERROR,
          400
        ),
      ];
    }
    const [simulator, simulatorError] = isObject(json.simulator)
      ? Simulator.create(json.simulator)
      : [json.simulator, null];
    if (simulatorError) {
      return [null, simulatorError];
    }

    return [
      new Session(
        {
          startedOn: json.startedOn ? new Date(json.startedOn) : new Date(),
          device: device!,
          virtualMachine: virtualMachine!,
          simulator: simulator!,
        },
        json._id
      ),
      null,
    ];
  }
}
