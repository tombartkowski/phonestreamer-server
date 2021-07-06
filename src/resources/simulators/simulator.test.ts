import { expect } from 'chai';
import fc from 'fast-check';
import { Types } from 'mongoose';
import { ErrorCode } from '../../core/AppError';
import { Simulator } from './simulator';
import faker from 'faker';
import { Device } from '../devices/device';
import { VirtualMachine } from '../virtualMachines/virtualMachine';

describe('Simulator Entity', function () {
  const makeValidInput = () => {
    return {
      device: new Types.ObjectId(),
      virtualMachine: new Types.ObjectId(),
      _id: new Types.ObjectId(),
    };
  };

  const makeValidObjectInput = () => ({
    device: makeDeviceJson(),
    virtualMachine: makeVirtualMachineJson(),
  });

  const makeDeviceJson = () => ({
    typeIdentifier: 'IPHONE_8',
    previewImageUrl: faker.internet.url(),
    _id: new Types.ObjectId(),
  });

  const makeVirtualMachineJson = () => ({
    remoteUrl: faker.internet.url(),
    _id: new Types.ObjectId(),
  });

  describe('#create', function () {
    it(`when created with id's as values of the reference types, expect created Simulator to have id's as references values.`, function () {
      //Arrange
      const validInput = makeValidInput();
      //Act
      const [simulator] = Simulator.create(validInput);
      //Assert
      expect(simulator?.device).to.be.equal(validInput.device);
      expect(simulator?.virtualMachine).to.be.equal(validInput.virtualMachine);
    });

    it(`when created with objects as values of the reference types, expect created Simulator to have entities as reference values.`, function () {
      //Arrange
      const validInput = makeValidObjectInput();
      //Act
      const [simulator] = Simulator.create(validInput);
      //Assert
      expect(simulator?.device).to.be.an.instanceOf(Device);
      expect(simulator?.virtualMachine).to.be.an.instanceOf(VirtualMachine);
    });

    it(`when created with mix of id's and objects as values of the reference types, expect created Simulator to have a mix of ids and entities as reference values.`, function () {
      //Arrange
      const validInput = {
        ...makeValidObjectInput(),
        virtualMachine: new Types.ObjectId(),
      };
      //Act
      const [simulator] = Simulator.create(validInput);
      //Assert
      expect(simulator?.device).to.be.an.instanceOf(Device);
      expect(simulator?.virtualMachine).to.be.an.instanceOf(Types.ObjectId);
    });

    it(`when created without device, expect validation error.`, function () {
      //Arrange
      const invalidInput = { ...makeValidInput(), device: undefined };
      //Act
      const [, error] = Simulator.create(invalidInput);
      //Assert
      expect(error).to.have.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });

    it(`when created without virtual machine, expect validation error.`, function () {
      //Arrange
      const invalidInput = { ...makeValidInput(), virtualMachine: undefined };
      //Act
      const [, error] = Simulator.create(invalidInput);
      //Assert
      expect(error).to.have.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });

    it(`when created with invalid identifier, expect validation error.`, function () {
      //Arrange
      const invalidInput = { ...makeValidInput(), identifier: 'foo' };
      //Act
      const [, error] = Simulator.create(invalidInput);
      //Assert
      expect(error).to.have.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });
  });

  describe('#update', function () {
    it(`when called with any input, always expect null`, function () {
      fc.assert(
        //Arrange
        fc.property(fc.anything(), anything => {
          const [simulator] = Simulator.create(makeValidInput());
          //Act
          const result = simulator?.update(anything);
          //Assert
          expect(result).to.always.be.null;
        })
      );
    });
  });

  describe('#toJson', function () {
    it(`when called, expect plain object with valid keys.`, function () {
      //Arrange
      const [simulator] = Simulator.create(makeValidInput());
      //Act
      const json = simulator?.toJson();
      //Assert
      expect(json).to.have.property('_id');
      expect(json).to.have.property('device');
      expect(json).to.have.property('virtualMachine');
    });
  });

  describe('#toDto', function () {
    it(`when called, returns plain object with correct keys.`, function () {
      //Arrange
      const [simulator] = Simulator.create(makeValidInput());
      //Act
      const json = simulator?.toDto();
      //Assert
      expect(json).to.have.property('id');
      expect(json).to.have.property('device');
      expect(json).to.have.property('virtualMachine');
    });
  });
});
