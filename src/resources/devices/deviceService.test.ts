import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { ErrorCode } from '../../core/AppError';
import { Device } from './device';
import deviceService from './deviceService';
import { Repository } from '../../core/repository';
import { stubInterface } from 'ts-sinon';
import { Result } from '../../core/resolve';
import { QueryOptions } from 'mongoose-query-parser';
import faker from 'faker';
import { Types } from 'mongoose';
chai.use(sinonChai);

describe('DeviceService', function () {
  const stubRepository = stubInterface<Repository<Device>>();
  const service = deviceService(stubRepository);

  const makeValidInput = () => ({
    typeIdentifier: 'IPHONE_8',
    previewImageUrl: faker.internet.url(),
  });

  const makeDevice = (): Device => {
    const [device] = Device.create({
      typeIdentifier: 'IPHONE_8',
      previewImageUrl: faker.internet.url(),
      _id: new Types.ObjectId(),
    });
    return device!;
  };

  const resetStubRepository = () => {
    stubRepository.save.resetHistory();
    stubRepository.findById.resetHistory();
    stubRepository.find.resetHistory();
    stubRepository.delete.resetHistory();
    stubRepository.updateOne.resetHistory();
    stubRepository.save.callsFake(entity => {
      entity.id = new Types.ObjectId();
      return Promise.resolve(Result.ok(entity));
    });

    const entity = makeDevice();
    stubRepository.findById.resolves(Result.ok(entity));
    stubRepository.find.resolves(Result.ok([entity]));
  };

  beforeEach(function () {
    resetStubRepository();
  });

  describe('#createDevice', function () {
    it(`when creating with valid body, expect created Device.`, async function () {
      //Arrange
      const body = makeValidInput();
      //Act
      const [device] = await service.createDevice(body);
      //Assert
      expect(device).to.be.an.instanceOf(Device);
    });

    it(`when creating with invalid body, expect validation error.`, async function () {
      //Arrange
      const body = {};
      //Act
      const [, error] = await service.createDevice(body);
      //Assert
      expect(error).to.have.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });
  });

  describe('#findSessions', function () {
    it(`when finding with a query, expect calling repository with it.`, async function () {
      //Arrange
      const stubQuery = stubInterface<QueryOptions>();
      //Act
      await service.findDevices(stubQuery);
      //Assert
      expect(stubRepository.find).to.have.been.calledWith(stubQuery);
    });
  });

  describe('#findDeviceById', function () {
    it(`when finding with an id and query, expect calling repository with both.`, async function () {
      //Arrange
      const stubQuery = stubInterface<QueryOptions>();
      const id = new Types.ObjectId().toHexString();
      //Act
      await service.findDeviceById(id, stubQuery);
      //Assert
      expect(stubRepository.findById).to.have.been.calledWith(id, stubQuery);
    });
  });

  describe('#deleteDevice', function () {
    it(`when deleting with an id, expect calling repository with it.`, async function () {
      //Arrange
      const id = new Types.ObjectId().toHexString();
      //Act
      await service.deleteDevice(id);
      //Assert
      expect(stubRepository.delete).to.have.been.calledWith(id);
    });
  });

  describe('#patchDevice', function () {
    it(`when updating with an id and a body, expect calling repository with both.`, async function () {
      //Arrange
      const body = {};
      const id = 'identifier';
      //Act
      await service.patchDevice(id, body);
      //Assert
      expect(stubRepository.updateOne).to.have.been.calledWith(id, body);
    });
  });
});
