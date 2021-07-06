import { expect } from 'chai';
import fc from 'fast-check';
import { Types } from 'mongoose';
import { ErrorCode } from '../../core/AppError';
import { Session } from './session';
import faker from 'faker';
import { Device } from '../devices/device';
import { VirtualMachine } from '../virtualMachines/virtualMachine';
import { Simulator } from '../simulators/simulator';

describe('Session Entity', function () {
  const makeValidInput = () => {
    return {
      startedOn: new Date(),
      device: new Types.ObjectId(),
      virtualMachine: new Types.ObjectId(),
      simulator: new Types.ObjectId(),
      _id: new Types.ObjectId(),
    };
  };

  const makeValidObjectInput = () => ({
    startedOn: new Date(),
    device: makeDeviceJson(),
    virtualMachine: makeVirtualMachineJson(),
    simulator: makeSimulatorJson(),
  });

  const makeDeviceJson = () => ({
    typeIdentifier: 'IPHONE_8',
    previewImageUrl: faker.internet.url(),
    _id: new Types.ObjectId(),
  });

  const makeSimulatorJson = () => ({
    identifier: faker.datatype.string(6),
    device: new Types.ObjectId(),
    virtualMachine: new Types.ObjectId(),
    _id: new Types.ObjectId(),
  });

  const makeVirtualMachineJson = () => ({
    remoteUrl: faker.internet.url(),
    _id: new Types.ObjectId(),
  });

  describe('#create', function () {
    it(`when created with id's as values of the reference types, expect created Session to have id's as references values.`, function () {
      //Arrange
      const validInput = makeValidInput();
      //Act
      const [session] = Session.create(validInput);
      //Assert
      expect(session?.startedOn).to.be.deep.equal(validInput.startedOn);
      expect(session?.device).to.be.equal(validInput.device);
      expect(session?.virtualMachine).to.be.equal(validInput.virtualMachine);
      expect(session?.simulator).to.be.equal(validInput.simulator);
    });

    it(`when created with objects as values of the reference types, expect created Session to have entities as reference values.`, function () {
      //Arrange
      const validInput = makeValidObjectInput();
      //Act
      const [session] = Session.create(validInput);
      //Assert
      expect(session?.device).to.be.an.instanceOf(Device);
      expect(session?.virtualMachine).to.be.an.instanceOf(VirtualMachine);
      expect(session?.simulator).to.be.an.instanceOf(Simulator);
    });

    it(`when created with mix of id's and objects as values of the reference types, expect created Session to have a mix of ids and entities as reference values.`, function () {
      //Arrange
      const validInput = {
        ...makeValidObjectInput(),
        virtualMachine: new Types.ObjectId(),
      };
      //Act
      const [session] = Session.create(validInput);
      //Assert
      expect(session?.device).to.be.an.instanceOf(Device);
      expect(session?.virtualMachine).to.be.an.instanceOf(Types.ObjectId);
      expect(session?.simulator).to.be.an.instanceOf(Simulator);
    });

    it(`when created without startedOn date, expect Simulator with current startedOn date.`, function () {
      //Arrange
      const validInput = { ...makeValidInput(), startedOn: null };
      const referenceDate = new Date();
      //Act
      const [session] = Session.create(validInput);
      //Assert
      expect(session?.startedOn).to.be.a('date');
    });

    it(`when created without device, expect validation error.`, function () {
      //Arrange
      const invalidInput = { ...makeValidInput(), device: undefined };
      //Act
      const [, error] = Session.create(invalidInput);
      //Assert
      expect(error).to.have.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });

    it(`when created without virtual machine, expect validation error.`, function () {
      //Arrange
      const invalidInput = { ...makeValidInput(), virtualMachine: undefined };
      //Act
      const [, error] = Session.create(invalidInput);
      //Assert
      expect(error).to.have.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });

    it(`when created without simulator, expect validation error.`, function () {
      //Arrange
      const invalidInput = { ...makeValidInput(), simulator: undefined };
      //Act
      const [, error] = Session.create(invalidInput);
      //Assert
      expect(error).to.have.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });
  });

  describe('#update', function () {
    it(`when called with any input, always expect null`, function () {
      fc.assert(
        //Arrange
        fc.property(fc.anything(), anything => {
          const [session] = Session.create(makeValidInput());
          //Act
          const result = session?.update(anything);
          //Assert
          expect(result).to.always.be.null;
        })
      );
    });
  });

  describe('#toJson', function () {
    it(`when called, expect plain object with valid keys.`, function () {
      //Arrange
      const [session] = Session.create(makeValidInput());
      //Act
      const json = session?.toJson();
      //Assert
      expect(json).to.have.property('_id');
      expect(json).to.have.property('startedOn');
      expect(json).to.have.property('device');
      expect(json).to.have.property('virtualMachine');
      expect(json).to.have.property('simulator');
    });
  });

  describe('#toDto', function () {
    it(`when called, returns plain object with correct keys.`, function () {
      //Arrange
      const [session] = Session.create(makeValidInput());
      //Act
      const json = session?.toDto();
      //Assert
      expect(json).to.have.property('id');
      expect(json).to.have.property('startedOn');
      expect(json).to.have.property('device');
      expect(json).to.have.property('virtualMachine');
      expect(json).to.have.property('simulator');
    });
  });
});
