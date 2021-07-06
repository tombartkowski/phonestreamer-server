import { expect } from 'chai';
import { VirtualMachine } from '../../../src/resources/virtualMachines/virtualMachine';
import fc from 'fast-check';
import { ErrorCode } from '../../core/AppError';
import { values } from '../../core/utils';
import faker from 'faker';
import { Types } from 'mongoose';
describe('VirtualMachine Entity', function () {
  const makeInput = () => ({
    remoteUrl: faker.internet.url(),
    _id: new Types.ObjectId(),
  });

  describe('#create', function () {
    it(`when created with correct remote Url, expect created VirtualMachine to have a correct remote Url.`, function () {
      //Arrange
      const validInput = makeInput();
      //Act
      const [virtualMachine] = VirtualMachine.create(validInput);
      //Assert
      expect(virtualMachine?.remoteUrl).to.be.equal(validInput.remoteUrl);
    });

    it(`when created with invalid remote url, expect validation error.`, function () {
      ////Arrange
      const validInput = {
        ...makeInput(),
        remoteUrl: 'invalid url',
      };
      //Act
      const [, error] = VirtualMachine.create(validInput);
      //Assert
      expect(error).to.have.a.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });
  });

  describe('#update', function () {
    it(`when updated with valid remote Url, expect VirtualMachine to have new remote Url.`, function () {
      //Arrange
      const [virtualMachine] = VirtualMachine.create(makeInput());
      const newProperties = {
        remoteUrl: faker.internet.url(),
      };
      //Act
      virtualMachine?.update(newProperties);
      //Assert
      expect(virtualMachine?.remoteUrl).to.be.equal(newProperties.remoteUrl);
    });

    it(`when updated with invalid image Url, expect validation error.`, function () {
      //Arrange
      const [virtualMachine] = VirtualMachine.create(makeInput());
      const newProperties = {
        remoteUrl: 'invalid url',
      };
      //Act
      const error = virtualMachine?.update(newProperties);
      //Assert
      expect(error).to.have.a.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });
  });

  describe('#toJson', function () {
    it(`when called on valid VirtualMachine, expect plain object with valid keys.`, function () {
      //Arrange
      const [virtualMachine] = VirtualMachine.create(makeInput());
      //Act
      const json = virtualMachine?.toJson();
      //Assert
      expect(json).to.have.property('_id').that.is.an.instanceOf(Types.ObjectId);
      expect(json).to.have.property('remoteUrl').that.is.a('string');
    });
  });

  describe('#toDto', function () {
    it(`when called, returns plain object with correct keys.`, function () {
      //Arrange
      const [virtualMachine] = VirtualMachine.create(makeInput());
      //Act
      const json = virtualMachine?.toDto();
      //Assert
      expect(json).to.have.property('id');
      expect(json).to.have.property('remoteUrl');
    });
  });
});
