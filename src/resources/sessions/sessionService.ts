import { Repository } from '../../core/repository';
import { Result, unwrap } from '../../core/resolve';
import { Session } from './session';
import { MongooseQueryParser, QueryOptions } from 'mongoose-query-parser';
import { HTTP } from '../../networking/http';
import { Api } from '../../networking/api.virtuaMachine';
import { Device } from '../devices/device';
import { Simulator } from '../simulators/simulator';
import { VirtualMachine } from '../virtualMachines/virtualMachine';
import { AppError, ErrorCode, ErrorMessage, ErrorType } from '../../core/AppError';
import { RequestInput } from '../../core/controller';

export interface SessionService {
  createSession: (body: any) => Promise<Result<Session>>;
  findSessions: (input: RequestInput) => Promise<Result<Session[]>>;
  findSessionById: (id: string, input: RequestInput) => Promise<Result<Session>>;
  deleteSession: (id: string) => Promise<Result<Session>>;
  patchSession: (id: string, body: any) => Promise<Result<Session>>;
}

export default (
  sessionRepository: Repository<Session>,
  deviceRepository: Repository<Device>,
  simulatorRepository: Repository<Simulator>,
  virtualMachineRepository: Repository<VirtualMachine>,
  httpClient: HTTP.Client
): SessionService => {
  const parser = new MongooseQueryParser();
  const findAvailableVirtualMachine = async (): Promise<Result<VirtualMachine>> => {
    const virtualMachines = await unwrap(
      virtualMachineRepository.find({
        filter: {},
        limit: 1,
      })
    );

    const [virtualMachine, ..._rest] = virtualMachines!;
    if (!virtualMachine)
      return [
        null,
        new AppError(
          ErrorMessage.NoVirtualMachinesAvailable,
          ErrorType.INTERNAL,
          ErrorCode.NO_VIRTUAL_MACHINES_AVAILABLE,
          503
        ),
      ];
    return [virtualMachine, null];
  };

  const createSimulator = async (
    vm: VirtualMachine,
    device: Device
  ): Promise<Result<Simulator>> => {
    const [simulatorCandidate, simulatorCandidateError] = Simulator.create({
      virtualMachine: vm.id,
      device: device.id,
    });
    if (simulatorCandidateError) return [null, simulatorCandidateError];
    return simulatorRepository.save(simulatorCandidate!);
  };

  const createSession = async (
    device: Device,
    virtualMachine: VirtualMachine,
    simulator: Simulator
  ): Promise<Result<Session>> => {
    const [sessionCandidate, sessionCandidateError] = Session.create({
      device: device.id,
      virtualMachine: virtualMachine.id,
      simulator: simulator.id,
    });
    if (sessionCandidateError) {
      return [null, sessionCandidateError];
    }

    return sessionRepository.save(sessionCandidate!);
  };

  return {
    createSession: async (body: any) => {
      try {
        const device = await unwrap(deviceRepository.findById(body.deviceId));
        if (!device) {
          throw new AppError(
            ErrorMessage.InvalidField('deviceId'),
            ErrorType.USER,
            ErrorCode.VALIDATION_ERROR,
            400
          );
        }
        const virtualMachine = await unwrap(findAvailableVirtualMachine());
        const simulator = await unwrap(createSimulator(virtualMachine, device!));
        await unwrap(
          httpClient.request(
            Api.VirtualMachine.startSimulator(virtualMachine.remoteUrl, {
              simulatorIdentifier: simulator.identifier,
              deviceTypeIdentifier: device!.typeIdentifier,
            })
          )
        );
        await unwrap(
          httpClient.request(
            Api.VirtualMachine.startSession(virtualMachine.remoteUrl, {
              simulatorIdentifier: simulator.identifier,
            })
          )
        );
        const session = await unwrap(
          createSession(device!, virtualMachine, simulator)
        );
        return [session, null];
      } catch (error) {
        return [null, error];
      }
    },
    findSessions: async (input: RequestInput) =>
      sessionRepository.find(parser.parse(input.query)),
    findSessionById: async (id: string, input: RequestInput) =>
      sessionRepository.findById(id, parser.parse(input.query)),
    deleteSession: async (id: string) => sessionRepository.delete(id),
    patchSession: async (id: string, body: any) =>
      sessionRepository.updateOne(id, body),
  };
};
