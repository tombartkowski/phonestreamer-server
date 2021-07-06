import { expect } from 'chai';
import fc from 'fast-check';
import { ErrorCode } from '../../../core/AppError';
import isURL from 'validator/lib/isURL';
import { SimulatorIdentifier } from './simulatorIdentifier';

describe('SimulatorIdentifier ValueObject', function () {
  describe('#create', function () {
    it(`when creating without input, expect SimulatorIdentifier to have a new identifier with lenght of 6.`, function () {
      //Act
      const [simulatorIdentifier] = SimulatorIdentifier.create();
      //Assert
      expect(simulatorIdentifier?.value).to.be.a('string').with.lengthOf(6);
    });

    it(`when creating with a string of length 6, expect SimulatorIdentifier to have the same value.`, function () {
      fc.assert(
        //Arrange
        fc.property(
          fc
            .string({ minLength: 6, maxLength: 6 })
            .filter(s => s.trim().length === 6),
          identifier => {
            //Act
            const [simulatorIdentifier] = SimulatorIdentifier.create(identifier);
            //Assert
            expect(simulatorIdentifier?.value).to.be.equal(identifier);
          }
        )
      );
    });

    it(`when creating with a string of length not equal 6, expect validation error.`, function () {
      fc.assert(
        //Arrange
        fc.property(
          fc.string({ minLength: 1 }).filter(s => s.trim().length !== 6),
          identifier => {
            //Act
            const [, error] = SimulatorIdentifier.create(identifier);
            //Assert
            expect(error).to.have.property('code').equal(ErrorCode.VALIDATION_ERROR);
          }
        )
      );
    });
  });

  describe('#toDto', function () {
    it(`when called, expect an object with only 'simulatorIdentifier' key.`, function () {
      fc.assert(
        //Arrange
        fc.property(
          fc
            .string({ minLength: 6, maxLength: 6 })
            .filter(s => s.trim().length === 6),
          identifier => {
            const [simulatorIdentifier] = SimulatorIdentifier.create(identifier);
            //Act
            const dto = simulatorIdentifier?.toDto();
            //Assert
            expect(dto).to.have.property('identifier');
            expect(Object.keys(dto)).to.have.lengthOf(1);
          }
        )
      );
    });
  });
});
