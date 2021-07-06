import { expect } from 'chai';
import fc from 'fast-check';
import { PreviewImageUrl } from './../valueObjects/devicePreviewImageUrl';
import { ErrorCode } from '../../../core/AppError';
import isURL from 'validator/lib/isURL';

describe('PreviewImageUrl ValueObject', function () {
  describe('#create', function () {
    it(`when creating with valid url, expect PreviewImageUrl to have it.`, function () {
      fc.assert(
        //Arrange
        fc.property(fc.webUrl(), url => {
          //Act
          const [previewImageUrl] = PreviewImageUrl.create(url);
          //Assert
          expect(previewImageUrl?.value).to.be.a('string').that.is.equal(url);
        })
      );
    });

    it(`when creating with invalid url, expect validation error.`, function () {
      fc.assert(
        //Arrange
        fc.property(
          fc.string().filter(s => !isURL(s)),
          url => {
            //Act
            const [, error] = PreviewImageUrl.create(url);
            //Assert
            expect(error)
              .to.have.a.property('code')
              .equal(ErrorCode.VALIDATION_ERROR);
          }
        )
      );
    });
  });

  describe('#toDto', function () {
    it(`when called, expect an object with only 'previewImageUrl' key.`, function () {
      fc.assert(
        fc.property(fc.webUrl(), input => {
          //Arrange
          const [previewImageUrl] = PreviewImageUrl.create(input);
          //Act
          const dto = previewImageUrl?.toDto();
          //Assert
          expect(dto).to.have.property('previewImageUrl');
          expect(Object.keys(dto)).to.have.lengthOf(1);
        })
      );
    });
  });
});
