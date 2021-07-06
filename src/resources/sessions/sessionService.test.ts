import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { ErrorCode } from '../../core/AppError';
import { Session } from './session';
import sessionService from './sessionService';
import { Repository } from '../../core/repository';
import { StubbedInstance, stubInterface } from 'ts-sinon';
import { Result } from '../../core/resolve';
import { QueryOptions } from 'mongoose-query-parser';
import { Device } from '../devices/device';
import { Simulator } from '../simulators/simulator';
import { VirtualMachine } from '../virtualMachines/virtualMachine';
import { HTTP } from '../../networking/http';
import { Types } from 'mongoose';
import faker from 'faker';
import { Entity } from '../../core/entity';

chai.use(sinonChai);

describe('SessionService', function () {
  const makeDevice = (): Device => {
    const [device] = Device.create({
      typeIdentifier: 'IPHONE_8',
      previewImageUrl: faker.internet.url(),
      _id: new Types.ObjectId(),
    });
    return device!;
  };

  const makeVirtualMachine = (): VirtualMachine => {
    const [virtualMachine] = VirtualMachine.create({
      remoteUrl: faker.internet.url(),
      _id: new Types.ObjectId(),
    });
    return virtualMachine!;
  };

  const resetStubRepository = <T extends Entity<any>>(
    stubRepository: StubbedInstance<Repository<any>>,
    entityFactory?: () => T
  ) => {
    stubRepository.save.resetHistory();
    stubRepository.findById.resetHistory();
    stubRepository.find.resetHistory();
    stubRepository.delete.resetHistory();
    stubRepository.updateOne.resetHistory();

    if (entityFactory) {
      const entity = entityFactory();
      stubRepository.findById.resolves(Result.ok(entity));
      stubRepository.find.resolves(Result.ok([entity]));
    }
    stubRepository.save.callsFake(entity => {
      entity.id = new Types.ObjectId();
      return Promise.resolve(Result.ok(entity));
    });
  };

  const makeRepository = <T extends Entity<any>>(entityFactory?: () => T) => {
    const stubRepository = stubInterface<Repository<T>>();
    if (entityFactory) {
      const entity = entityFactory();
      stubRepository.findById.resolves(Result.ok(entity));
      stubRepository.find.resolves(Result.ok([entity]));
    }
    stubRepository.save.callsFake(entity => {
      entity.id = new Types.ObjectId();
      return Promise.resolve(Result.ok(entity));
    });
    return stubRepository;
  };

  const stubSessionRepository: StubbedInstance<Repository<Session>> =
    makeRepository();
  const stubSimulatorRepository: StubbedInstance<Repository<Simulator>> =
    makeRepository();
  const stubDeviceRepository = makeRepository(makeDevice);
  const stubVirtualMachineRepository = makeRepository(makeVirtualMachine);
  const stubHttpClient = stubInterface<HTTP.Client>();
  stubHttpClient.request.resolves(Result.ok(''));

  const service = sessionService(
    stubSessionRepository,
    stubDeviceRepository,
    stubSimulatorRepository,
    stubVirtualMachineRepository,
    stubHttpClient
  );

  beforeEach(function () {
    resetStubRepository(stubSessionRepository);
    resetStubRepository(stubSimulatorRepository);
    resetStubRepository(stubDeviceRepository, makeDevice);
    resetStubRepository(stubVirtualMachineRepository, makeVirtualMachine);
    stubHttpClient.request.resetHistory();
  });

  describe('#createSession', function () {
    it(`when created with valid deviceId in request body, expect created Session to have device, simulator and virtualMachine with ObjectId values.`, async function () {
      //Arrange
      const body = {
        deviceId: new Types.ObjectId().toHexString(),
      };
      //Act
      const [session] = await service.createSession(body);
      //Assert
      expect(session)
        .to.have.property('device')
        .that.is.an.instanceOf(Types.ObjectId);
      expect(session)
        .to.have.property('simulator')
        .that.is.an.instanceOf(Types.ObjectId);
      expect(session)
        .to.have.property('virtualMachine')
        .that.is.an.instanceOf(Types.ObjectId);
    });

    it(`when creating, expect to make two API calls to the virtual machine.`, async function () {
      //Arrange
      const body = {
        deviceId: new Types.ObjectId().toHexString(),
      };
      //Act
      await service.createSession(body);
      //Assert
      expect(stubHttpClient.request).to.have.been.calledTwice;
    });

    it(`when no device is found, expect validation error.`, async function () {
      //Arrange
      stubDeviceRepository.findById.resolves(Result.ok(null));
      const body = {
        deviceId: new Types.ObjectId().toHexString(),
      };
      //Act
      const [, error] = await service.createSession(body);
      //Assert
      expect(error).to.have.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });

    it(`when no free virtual machine is found, expect error with 503 status code.`, async function () {
      //Arrange
      stubVirtualMachineRepository.find.resolves(Result.ok([]));
      const body = {
        deviceId: new Types.ObjectId().toHexString(),
      };
      //Act
      const [, error] = await service.createSession(body);
      //Assert
      expect(error).to.have.property('statusCode').equal(503);
    });

    it(`when simulator creation fails, expect validation error.`, async function () {
      //Arrange
      const device = makeDevice();
      device.id = undefined;
      stubDeviceRepository.findById.resolves(Result.ok(device));
      const body = {
        deviceId: new Types.ObjectId().toHexString(),
      };
      //Act
      const [, error] = await service.createSession(body);
      //Assert
      expect(error).to.have.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });

    it(`when session entity creation fails, expect validation error.`, async function () {
      //Arrange
      stubSimulatorRepository.save.callsFake(simulator => {
        simulator.id = undefined; //Creating Session with Simulator without id will cause an error.
        return Promise.resolve(Result.ok(simulator));
      });
      const body = {
        deviceId: new Types.ObjectId().toHexString(),
      };
      //Act
      const [, error] = await service.createSession(body);
      //Assert
      expect(error).to.have.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });
  });

  describe('#findSessions', function () {
    it(`when finding with a query, expect calling repository with it.`, async function () {
      //Arrange
      const stubQuery = stubInterface<QueryOptions>();
      //Act
      await service.findSessions(stubQuery);
      //Assert
      expect(stubSessionRepository.find).to.have.been.calledWith(stubQuery);
    });
  });

  describe('#findSessionById', function () {
    it(`when finding with an id and query, expect calling repository with both.`, async function () {
      //Arrange
      const stubQuery = stubInterface<QueryOptions>();
      const id = new Types.ObjectId().toHexString();
      //Act
      await service.findSessionById(id, stubQuery);
      //Assert
      expect(stubSessionRepository.findById).to.have.been.calledWith(id, stubQuery);
    });
  });

  describe('#deleteSession', function () {
    it(`when deleting with an id, expect calling repository with it.`, async function () {
      //Arrange
      const id = new Types.ObjectId().toHexString();
      //Act
      await service.deleteSession(id);
      //Assert
      expect(stubSessionRepository.delete).to.have.been.calledWith(id);
    });
  });

  describe('#patchSession', function () {
    it(`when updating with an id and a body, expect calling repository with both.`, async function () {
      //Arrange
      const body = {};
      const id = 'identifier';
      //Act
      await service.patchSession(id, body);
      //Assert
      expect(stubSessionRepository.updateOne).to.have.been.calledWith(id, body);
    });
  });
});
