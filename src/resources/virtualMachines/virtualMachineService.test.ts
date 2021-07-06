import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { ErrorCode } from '../../core/AppError';
import { VirtualMachine } from './virtualMachine';
import virtualMachineService from './virtualMachineService';
import { Repository } from '../../core/repository';
import { stubInterface } from 'ts-sinon';
import { Result } from '../../core/resolve';
import { QueryOptions } from 'mongoose-query-parser';
import { Types } from 'mongoose';
import faker from 'faker';
chai.use(sinonChai);

describe('VirtualMachineService', function () {
  const stubRepository = stubInterface<Repository<VirtualMachine>>();
  const service = virtualMachineService(stubRepository);

  const makeValidInput = () => ({
    remoteUrl: faker.internet.url(),
  });

  const makeVirtualMachine = (): VirtualMachine => {
    const [virtualMachine] = VirtualMachine.create({
      remoteUrl: faker.internet.url(),
      _id: new Types.ObjectId(),
    });
    return virtualMachine!;
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

    const entity = makeVirtualMachine();
    stubRepository.findById.resolves(Result.ok(entity));
    stubRepository.find.resolves(Result.ok([entity]));
  };

  beforeEach(function () {
    resetStubRepository();
  });

  describe('#createVirtualMachine', function () {
    it(`when creating with valid body, expect created VirtualMachine.`, async function () {
      //Arrange
      const body = makeValidInput();
      //Act
      const [virtualMachine] = await service.createVirtualMachine(body);
      //Assert
      expect(virtualMachine).to.be.an.instanceOf(VirtualMachine);
    });

    it(`when creating with invalid body, expect validation error.`, async function () {
      //Arrange
      const body = {};
      //Act
      const [, error] = await service.createVirtualMachine(body);
      //Assert
      expect(error).to.have.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });
  });

  describe('#findVirtualMachines', function () {
    it(`when finding with a query, expect calling repository with it.`, async function () {
      //Arrange
      const stubQuery = stubInterface<QueryOptions>();
      //Act
      await service.findVirtualMachines(stubQuery);
      //Assert
      expect(stubRepository.find).to.have.been.calledWith(stubQuery);
    });
  });

  describe('#findVirtualMachineById', function () {
    it(`when finding with an id and query, expect calling repository with both.`, async function () {
      //Arrange
      const stubQuery = stubInterface<QueryOptions>();
      const id = new Types.ObjectId().toHexString();
      //Act
      await service.findVirtualMachineById(id, stubQuery);
      //Assert
      expect(stubRepository.findById).to.have.been.calledWith(id, stubQuery);
    });
  });

  describe('#deleteVirtualMachine', function () {
    it(`when deleting with an id, expect calling repository with it.`, async function () {
      //Arrange
      const id = new Types.ObjectId().toHexString();
      //Act
      await service.deleteVirtualMachine(id);
      //Assert
      expect(stubRepository.delete).to.have.been.calledWith(id);
    });
  });

  describe('#patchVirtualMachine', function () {
    it(`when updating with an id and a body, expect calling repository with both.`, async function () {
      //Arrange
      const body = {};
      const id = 'identifier';
      //Act
      await service.patchVirtualMachine(id, body);
      //Assert
      expect(stubRepository.updateOne).to.have.been.calledWith(id, body);
    });
  });
});
