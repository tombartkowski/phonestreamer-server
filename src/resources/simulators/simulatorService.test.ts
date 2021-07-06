import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { ErrorCode } from '../../core/AppError';
import { Simulator } from './simulator';
import simulatorService from './simulatorService';
import { Repository } from '../../core/repository';
import { stubInterface } from 'ts-sinon';
import { Result } from '../../core/resolve';
import { QueryOptions } from 'mongoose-query-parser';
import { Types } from 'mongoose';
chai.use(sinonChai);

describe('SimulatorService', function () {
  const stubRepository = stubInterface<Repository<Simulator>>();
  const service = simulatorService(stubRepository);

  const makeValidInput = () => ({
    device: new Types.ObjectId().toHexString(),
    virtualMachine: new Types.ObjectId().toHexString(),
  });

  const makeSimulator = (): Simulator => {
    const [simulator] = Simulator.create({
      device: new Types.ObjectId(),
      virtualMachine: new Types.ObjectId(),
      _id: new Types.ObjectId(),
    });
    return simulator!;
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

    const entity = makeSimulator();
    stubRepository.findById.resolves(Result.ok(entity));
    stubRepository.find.resolves(Result.ok([entity]));
  };

  beforeEach(function () {
    resetStubRepository();
  });

  describe('#createSimulator', function () {
    it(`when creating with valid body, expect created Simulator.`, async function () {
      //Arrange
      const body = makeValidInput();
      //Act
      const [simulator] = await service.createSimulator(body);
      //Assert
      expect(simulator).to.be.an.instanceOf(Simulator);
    });

    it(`when creating with invalid body, expect validation error.`, async function () {
      //Arrange
      const body = {};
      //Act
      const [, error] = await service.createSimulator(body);
      //Assert
      expect(error).to.have.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });
  });

  describe('#findSimulators', function () {
    it(`when finding with a query, expect calling repository with it.`, async function () {
      //Arrange
      const stubQuery = stubInterface<QueryOptions>();
      //Act
      await service.findSimulators(stubQuery);
      //Assert
      expect(stubRepository.find).to.have.been.calledWith(stubQuery);
    });
  });

  describe('#findSimulatorById', function () {
    it(`when finding with an id and query, expect calling repository with both.`, async function () {
      //Arrange
      const stubQuery = stubInterface<QueryOptions>();
      const id = new Types.ObjectId().toHexString();
      //Act
      await service.findSimulatorById(id, stubQuery);
      //Assert
      expect(stubRepository.findById).to.have.been.calledWith(id, stubQuery);
    });
  });

  describe('#deleteSimulator', function () {
    it(`when deleting with an id, expect calling repository with it.`, async function () {
      //Arrange
      const id = new Types.ObjectId().toHexString();
      //Act
      await service.deleteSimulator(id);
      //Assert
      expect(stubRepository.delete).to.have.been.calledWith(id);
    });
  });

  describe('#patchSimulator', function () {
    it(`when updating with an id and a body, expect calling repository with both.`, async function () {
      //Arrange
      const body = {};
      const id = 'identifier';
      //Act
      await service.patchSimulator(id, body);
      //Assert
      expect(stubRepository.updateOne).to.have.been.calledWith(id, body);
    });
  });
});
