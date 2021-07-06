import { expect } from 'chai';
import { ErrorCode } from '../../../core/AppError';
import { DeviceModel } from './deviceModel';

describe('DeviceModel ValueObject', function () {
  describe('#create', function () {
    it(`when creating with valid type identfier, expect created DeviceModel.`, function () {
      //Arrange
      const validInput = 'IPHONE_8';
      //Act
      const [deviceModel] = DeviceModel.create(validInput);
      //Assert
      expect(deviceModel?.modelName).to.be.equal('iPhone 8');
      expect(deviceModel?.operatingSystemType).to.be.equal('IOS');
      expect(deviceModel?.operatingSystemVersionNumber).to.be.equal('14.4');
      expect(deviceModel?.typeIdentifier).to.be.equal('IPHONE_8');
    });

    it(`when creating with invalid type identfier, expect validation.`, function () {
      //Arrange
      const invalidInput = 'XIAOMI_REDMI_9';
      //Act
      const [, error] = DeviceModel.create(invalidInput);
      //Assert
      expect(error).to.have.a.property('code').equal(ErrorCode.VALIDATION_ERROR);
    });
  });

  describe('#toDto', function () {
    it(`when called, expect plain object with correct keys.`, function () {
      //Arrange
      const validInput = 'IPHONE_8';
      const [deviceModel] = DeviceModel.create(validInput);
      //Act
      const json = deviceModel?.toDto();
      //Assert
      expect(json).to.be.an('object');
      expect(json).to.have.property('modelName').equal('iPhone 8');
      expect(json).to.have.property('operatingSystemType').equal('IOS');
      expect(json).to.have.property('operatingSystemVersionNumber').equal('14.4');
      expect(json).to.have.property('typeIdentifier').equal('IPHONE_8');
    });
  });
});
