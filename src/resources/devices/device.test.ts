import { expect } from 'chai';
import { Device } from '../../../src/resources/devices/device';
import { ErrorCode } from '../../core/AppError';
import faker from 'faker';
import { Types } from 'mongoose';
describe('Device Entity', function () {
  const makeInput = (identifier: string = 'IPHONE_8') => ({
    typeIdentifier: identifier,
    previewImageUrl: faker.internet.url(),
    _id: new Types.ObjectId(),
  });

  describe('#create', function () {
    it(`when created with correct type identifier, expect created Device to have correctly filled properties.`, function () {
      //Arrange
      const validInput = makeInput('IPHONE_8');
      //Act
      const [device] = Device.create(validInput);
      //Assert
      expect(device?.modelName).to.be.equal('iPhone 8');
      expect(device?.operatingSystemType).to.be.equal('IOS');
      expect(device?.operatingSystemVersionNumber).to.be.equal('14.4');
      expect(device?.typeIdentifier).to.be.equal('IPHONE_8');
      expect(device?.previewImageUrl).to.be.equal(validInput.previewImageUrl);
    });

    it(`when created with invalid type identifier, expect validation error.`, function () {
      ///Arrange
      const validInput = makeInput('POCO_PHONE');
      //Act
      const [, error] = Device.create(validInput);
      //Assert
      expect(error).to.have.a.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });

    it(`when created with invalid image url, expect validation error.`, function () {
      ////Arrange
      const validInput = {
        ...makeInput(),
        previewImageUrl: 'invalid url',
      };
      //Act
      const [, error] = Device.create(validInput);
      //Assert
      expect(error).to.have.a.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });
  });

  describe('#update', function () {
    it(`when updated with valid image Url, expect Device to have new image Url.`, function () {
      //Arrange
      const [device] = Device.create(makeInput());
      const newProperties = {
        previewImageUrl: faker.internet.url(),
      };
      //Act
      device?.update(newProperties);
      //Assert
      expect(device?.previewImageUrl).to.be.equal(newProperties.previewImageUrl);
    });

    it(`when updated with invalid image Url, expect validation error.`, function () {
      //Arrange
      const [device] = Device.create(makeInput());
      const newProperties = {
        previewImageUrl: 'invalid url',
      };
      //Act
      const error = device?.update(newProperties);
      //Assert
      expect(error).to.have.a.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });
  });

  describe('#toJson', function () {
    it(`when called on valid Device, expect plain object with valid keys.`, function () {
      //Arrange
      const [device] = Device.create(makeInput('IPHONE_8'));
      //Act
      const json = device?.toJson();
      //Assert
      expect(json).to.have.property('_id').that.is.an.instanceOf(Types.ObjectId);
      expect(json).to.have.property('modelName').equal('iPhone 8');
      expect(json).to.have.property('operatingSystemType').equal('IOS');
      expect(json).to.have.property('operatingSystemVersionNumber').equal('14.4');
      expect(json).to.have.property('typeIdentifier').equal('IPHONE_8');
      expect(json).to.have.property('previewImageUrl').that.is.a('string');
    });
  });

  describe('#toDto', function () {
    it(`when called, returns plain object with correct keys.`, function () {
      //Arrange
      const [device] = Device.create(makeInput('IPHONE_8'));
      //Act
      const json = device?.toDto();
      //Assert
      expect(json).to.have.property('id');
      expect(json).to.have.property('modelName');
      expect(json).to.have.property('operatingSystemType');
      expect(json).to.have.property('operatingSystemVersionNumber');
      expect(json).to.have.property('typeIdentifier');
      expect(json).to.have.property('previewImageUrl');
    });
  });
});
