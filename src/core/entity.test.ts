import { Types } from 'mongoose';
import isMongoId from 'validator/lib/isMongoId';
import { AppError, ErrorCode, ErrorMessage, ErrorType } from '../core/AppError';
import { Entity, EntityOrId } from '../core/entity';
import { Result } from '../core/resolve';
import { isObject } from '../core/utils';
import { ValueObject } from './valueObject';

interface TestValueObjectProps extends Record<string, any> {
  propertyOne: string;
  propertyTwo: number;
}

class TestValueObject extends ValueObject<TestValueObjectProps> {
  private constructor(props: TestValueObjectProps) {
    super(props);
  }

  public static create(properties: any): Result<TestValueObject> {
    return [
      new TestValueObject({
        propertyOne: properties.propertyOne,
        propertyTwo: properties.propertyTwo,
      }),
      null,
    ];
  }
  public toDto(): any {
    return {
      propertyOne: this.props.propertyOne,
      propertyTwo: this.props.propertyTwo,
    };
  }
}

interface TestEntityProps extends Record<string, any> {
  primitiveProperty: string;
  referenceProperty: EntityOrId<TestEntity>;
  valueObjectProperty: TestValueObject;
}

class TestEntity extends Entity<TestEntityProps> {
  get primitiveProperty(): string {
    return this.props.startedOn;
  }

  get referenceProperty(): EntityOrId<TestEntity> {
    return this.props.referenceProperty;
  }

  get valueObjectProperty(): TestValueObject {
    return this.props.valueObjectProperty;
  }

  public toJson(): any {
    return {
      _id: this.id,
      primitiveProperty: this.props.primitiveProperty,
      valueObjectProperty: this.props.valueObjectProperty,
      referenceProperty: this.props.referenceProperty,
    };
  }

  public update(_updateQuery: any): Error | null {
    return null;
  }

  private constructor(props: TestEntityProps, id?: string) {
    super(props, id);
  }

  public static create(json: any): Result<TestEntity> {
    if (
      json.referenceProperty === undefined ||
      !(isObject(json.referenceProperty) || isMongoId(json.referenceProperty + ''))
    ) {
      return [
        null,
        new AppError(
          ErrorMessage.InvalidOrMissingField('referenceProperty'),
          ErrorType.USER,
          ErrorCode.VALIDATION_ERROR,
          400
        ),
      ];
    }

    const [referenceProperty] = isObject(json.referenceProperty)
      ? TestEntity.create(json.referenceProperty)
      : [json.referenceProperty, null];

    const [valueObject] = TestValueObject.create({
      propertyOne: json.propertyOne,
      propertyTwo: json.propertyTwo,
    });

    return [
      new TestEntity(
        {
          primitiveProperty: json.primitiveProperty,
          valueObjectProperty: valueObject!,
          referenceProperty: referenceProperty,
        },
        json._id
      ),
      null,
    ];
  }
}

import { expect } from 'chai';
describe('Entity', function () {
  const makeValidIdInput = () => ({
    primitiveProperty: 'foo',
    referenceProperty: new Types.ObjectId(),
    propertyOne: 'bar',
    propertyTwo: 42,
    _id: new Types.ObjectId(),
  });

  const makeValidObjectInput = () => ({
    primitiveProperty: 'foo',
    referenceProperty: makeValidIdInput(),
    propertyOne: 'bar',
    propertyTwo: 42,
    _id: new Types.ObjectId(),
  });

  describe('#toDto', function () {
    it(`when called without selection with id as referenceProperty, expect plain object with string referenceProperty.`, function () {
      //Arrange
      const properties = makeValidIdInput();
      const [entity] = TestEntity.create(properties);
      //Act
      const json = entity?.toDto();
      //Assert
      expect(json).to.be.an('object');
      expect(json)
        .to.have.property('id')
        .that.is.a('string')
        .equal(properties._id.toHexString());
      expect(json)
        .to.have.property('primitiveProperty')
        .that.is.a('string')
        .equal(properties.primitiveProperty);
      expect(json)
        .to.have.property('propertyOne')
        .that.is.a('string')
        .equal(properties.propertyOne);
      expect(json)
        .to.have.property('propertyTwo')
        .that.is.a('number')
        .equal(properties.propertyTwo);
      expect(json)
        .to.have.property('referenceProperty')
        .that.is.a('string')
        .equal(properties.referenceProperty.toHexString());
    });

    it(`when called without selection with Entities properties, expect plain object with object referenceProperty.`, function () {
      //Arrange
      const properties = makeValidObjectInput();
      const [entity] = TestEntity.create(properties);
      //Act
      const json = entity?.toDto();
      //Assert
      expect(json).to.be.an('object');
      expect(json)
        .to.have.property('id')
        .that.is.a('string')
        .equal(properties._id.toHexString());
      expect(json)
        .to.have.property('primitiveProperty')
        .that.is.a('string')
        .equal(properties.primitiveProperty);
      expect(json)
        .to.have.property('propertyOne')
        .that.is.a('string')
        .equal(properties.propertyOne);
      expect(json)
        .to.have.property('propertyTwo')
        .that.is.a('number')
        .equal(properties.propertyTwo);
      expect(json)
        .to.have.property('referenceProperty')
        .that.is.an('object')
        .deep.equal((entity?.referenceProperty as any).toDto());
    });

    it(`when called with inclusive selection that has no '_id' key, expect plain object with only selected keys plus '_id'.`, function () {
      //Arrange
      const properties = makeValidObjectInput();
      const [entity] = TestEntity.create(properties);
      const selection = { primitiveProperty: 1 };
      //Act
      const json = entity?.toDto(selection);
      //Assert
      expect(json).to.have.property('id');
      expect(json).to.have.property('primitiveProperty');
      expect(json).to.not.have.property('propertyOne');
      expect(json).to.not.have.property('propertyTwo');
      expect(json).to.not.have.property('referenceProperty');
    });

    it(`when called with inclusive selection that excludes '_id', expect plain object with only selected keys and undefined '_id'.`, function () {
      //Arrange
      const properties = makeValidObjectInput();
      const [entity] = TestEntity.create(properties);
      const selection = { _id: 0, primitiveProperty: 1 };
      //Act
      const json = entity?.toDto(selection);
      //Assert
      expect(json).to.have.property('id').that.is.undefined;
      expect(json).to.have.property('primitiveProperty');
      expect(json).to.not.have.property('propertyOne');
      expect(json).to.not.have.property('propertyTwo');
      expect(json).to.not.have.property('referenceProperty');
    });

    it(`when called with exclusive selection, expect plain object with only selected keys.`, function () {
      //Arrange
      const properties = makeValidObjectInput();
      const [entity] = TestEntity.create(properties);
      const selection = { primitiveProperty: 0, propertyOne: 0 };
      //Act
      const json = entity?.toDto(selection);
      //Assert
      expect(json).to.not.have.property('propertyOne');
      expect(json).to.not.have.property('primitiveProperty');
      expect(json).to.have.property('id');
      expect(json).to.have.property('propertyTwo');
      expect(json).to.have.property('referenceProperty');
    });
  });
});
