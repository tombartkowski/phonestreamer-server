import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { AppError, ErrorCode, ErrorMessage } from './AppError';
import { stubInterface } from 'ts-sinon';
import sinon, { SinonStub, stub } from 'sinon';
import { controller } from './controller.default';
import { Entity } from './entity';
import { Request, Response } from 'express';
import { Result } from './resolve';
import faker from 'faker';
chai.use(sinonChai);

type ServiceFunction = SinonStub<[], Promise<Result<Entity<any>>>>;
type ListServiceFunction = SinonStub<[], Promise<Result<Entity<any>[]>>>;

describe('Default Controller', function () {
  const stubRequest = stubInterface<Request>();
  stubRequest.params = {};
  stubRequest.query = {};
  stubRequest.body = {};

  const stubResponse = stubInterface<Response>();
  stubResponse.json.returns(stubResponse);
  stubResponse.status.returns(stubResponse);

  const stubEntity = stubInterface<Entity<any>>();
  const expectedJson = { device: faker.commerce.product() };
  stubEntity.toDto.returns(expectedJson);

  const stubServiceFunction: ServiceFunction = sinon.stub();
  const stubServiceListFunction: ListServiceFunction = sinon.stub();

  beforeEach(function () {
    stubServiceFunction.resetHistory();
    stubServiceListFunction.resetHistory();
    stubEntity.toDto.resetHistory();

    stubRequest.params = {};
    stubRequest.query = {};
    stubRequest.body = {};

    stubResponse.json.reset();
    stubResponse.status.reset();
    stubResponse.sendStatus.reset();
    stubResponse.json.returns(stubResponse);
    stubResponse.status.returns(stubResponse);
  });

  describe('#handleCreate', function () {
    it(`When creation is successful, expect 201 status code and JSON in response.`, async function () {
      //Arrange
      stubServiceFunction.resolves(Result.ok(stubEntity));
      //Act
      await controller().handleCreate(
        stubRequest,
        stubResponse,
        stubServiceFunction
      );
      //Assert
      expect(stubResponse.status).to.have.been.calledOnceWithExactly(201);
      expect(stubResponse.json).to.have.been.calledOnceWithExactly(expectedJson);
    });

    it(`When creation fails, expect 500 status code and error with message and code in response body.`, async function () {
      //Arrange
      stubServiceFunction.returns(
        Promise.resolve(Result.error(AppError.withCode(500)))
      );
      //Act
      await controller().handleCreate(
        stubRequest,
        stubResponse,
        stubServiceFunction
      );
      //Assert
      const expectedResponseBody = {
        error: {
          code: ErrorCode.UNKOWN_ERROR,
          message: ErrorMessage.UnkownError,
        },
      };
      expect(stubResponse.status).to.have.been.calledOnceWithExactly(500);
      expect(stubResponse.json).to.have.been.calledOnceWithExactly(
        expectedResponseBody
      );
    });
  });

  describe('#handleFindList', function () {
    it(`When fetch is successful, expect 200 status code and a list as a JSON response.`, async function () {
      //Arrange
      stubServiceListFunction.returns(Promise.resolve(Result.ok([stubEntity])));
      //Act
      await controller().handleFindList(
        stubRequest,
        stubResponse,
        stubServiceListFunction
      );
      //Assert
      expect(stubResponse.status).to.have.been.calledOnceWithExactly(200);
      expect(stubResponse.json).to.have.been.calledOnceWithExactly([expectedJson]);
    });

    it(`When fetch result is empty, expect 200 status code and empty list.`, async function () {
      //Arrange
      stubServiceListFunction.returns(Promise.resolve(Result.ok([])));

      //Act
      await controller().handleFindList(
        stubRequest,
        stubResponse,
        stubServiceListFunction
      );
      //Assert
      expect(stubResponse.status).to.have.been.calledOnceWithExactly(200);
      expect(stubResponse.json).to.have.been.calledOnceWithExactly([]);
    });

    it(`When request has a field selection query, expect attempt to filter the results.`, async function () {
      //Arrange
      stubRequest.query = { select: 'field' };
      stubServiceListFunction.returns(Promise.resolve(Result.ok([stubEntity])));
      //Act
      await controller().handleFindList(
        stubRequest,
        stubResponse,
        stubServiceListFunction
      );
      //Assert
      expect(stubEntity.toDto).to.have.been.calledOnceWithExactly({ field: 1 });
    });

    it(`When fetch fails, expect 500 status code.`, async function () {
      //Arrange
      stubServiceListFunction.resolves(Result.error(AppError.withCode(500)));
      //Act
      await controller().handleFindList(
        stubRequest,
        stubResponse,
        stubServiceListFunction
      );
      //Assert
      const expectedResponseBody = {
        error: {
          code: ErrorCode.UNKOWN_ERROR,
          message: ErrorMessage.UnkownError,
        },
      };
      expect(stubResponse.status).to.have.been.calledOnceWithExactly(500);
      expect(stubResponse.json).to.have.been.calledOnceWithExactly(
        expectedResponseBody
      );
    });
  });

  describe('#handleFindById', function () {
    it(`When request has an id param, expect serviceFunction to be called with it.`, async function () {
      //Arrange
      stubRequest.params = { id: faker.datatype.uuid() };
      stubServiceFunction.returns(Promise.resolve(Result.ok(stubEntity)));
      //Act
      await controller().handleFindById(
        stubRequest,
        stubResponse,
        stubServiceFunction
      );
      //Assert
      expect(stubServiceFunction).to.have.been.calledOnceWith(stubRequest.params.id);
    });

    it(`When fetch is successful, expect 200 status code and JSON object in the response body.`, async function () {
      //Arrange
      stubServiceFunction.returns(Promise.resolve(Result.ok(stubEntity)));
      //Act
      await controller().handleFindById(
        stubRequest,
        stubResponse,
        stubServiceFunction
      );
      //Assert
      expect(stubResponse.status).to.have.been.calledOnceWithExactly(200);
      expect(stubResponse.json).to.have.been.calledOnceWithExactly(expectedJson);
    });

    it(`When fetch result is null, expect 404 status code.`, async function () {
      //Arrange
      stubServiceFunction.returns(Promise.resolve([null, null]));
      //Act
      await controller().handleFindById(
        stubRequest,
        stubResponse,
        stubServiceFunction
      );
      //Assert
      expect(stubResponse.status).to.have.been.calledOnceWithExactly(404);
    });

    it(`When request has a field selection query, expect attempt to filter the result object.`, async function () {
      //Arrange
      stubRequest.query = { select: 'field' };
      stubServiceFunction.returns(Promise.resolve(Result.ok(stubEntity)));
      //Act
      await controller().handleFindById(
        stubRequest,
        stubResponse,
        stubServiceFunction
      );
      //Assert
      expect(stubEntity.toDto).to.have.been.calledOnceWithExactly({ field: 1 });
    });

    it(`When fetch fails, expect 500 status code and error with message and code in response body.`, async function () {
      //Arrange
      stubServiceFunction.resolves(Result.error(AppError.withCode(500)));
      //Act
      await controller().handleFindById(
        stubRequest,
        stubResponse,
        stubServiceFunction
      );
      //Assert
      const expectedResponseBody = {
        error: {
          code: ErrorCode.UNKOWN_ERROR,
          message: ErrorMessage.UnkownError,
        },
      };
      expect(stubResponse.json).to.have.been.calledOnceWithExactly(
        expectedResponseBody
      );
      expect(stubResponse.status).to.have.been.calledOnceWithExactly(500);
    });
  });

  describe('#handleDelete', function () {
    it(`When request has an id param, expect serviceFunction to be called with it.`, async function () {
      //Arrange
      stubRequest.params = { id: faker.datatype.uuid() };
      stubServiceFunction.returns(Promise.resolve(Result.ok(stubEntity)));
      //Act
      await controller().handleDelete(
        stubRequest,
        stubResponse,
        stubServiceFunction
      );
      //Assert
      expect(stubServiceFunction).to.have.been.calledOnceWith(stubRequest.params.id);
    });

    it(`When deletion is successful, expect 204 status code and an empty response body.`, async function () {
      //Arrange
      stubServiceFunction.returns(Promise.resolve(Result.ok(stubEntity)));
      //Act
      await controller().handleDelete(
        stubRequest,
        stubResponse,
        stubServiceFunction
      );
      //Assert
      expect(stubResponse.sendStatus).to.have.been.calledOnceWithExactly(204);
      expect(stubResponse.json).to.not.have.been.called;
    });

    it(`When deletion fails, expect 500 status code and error with message and code in response body.`, async function () {
      //Arrange
      stubServiceFunction.resolves(Result.error(AppError.withCode(500)));
      //Act
      await controller().handleDelete(
        stubRequest,
        stubResponse,
        stubServiceFunction
      );
      //Assert
      const expectedResponseBody = {
        error: {
          code: ErrorCode.UNKOWN_ERROR,
          message: ErrorMessage.UnkownError,
        },
      };
      expect(stubResponse.json).to.have.been.calledOnceWithExactly(
        expectedResponseBody
      );
      expect(stubResponse.status).to.have.been.calledOnceWithExactly(500);
    });
  });

  describe('#handlePatch', function () {
    it(`When update is successful, expect 200 status code and updated object as a JSON response.`, async function () {
      //Arrange
      stubServiceFunction.returns(Promise.resolve(Result.ok(stubEntity)));
      //Act
      await controller().handlePatch(stubRequest, stubResponse, stubServiceFunction);
      //Assert
      expect(stubResponse.status).to.have.been.calledOnceWithExactly(200);
      expect(stubResponse.json).to.have.been.calledOnceWithExactly(expectedJson);
    });

    it(`When request has an id param and a body, expect serviceFunction to be called with both.`, async function () {
      //Arrange
      stubRequest.params = { id: faker.datatype.uuid() };
      stubRequest.body = { device: faker.commerce.product() };
      stubServiceFunction.returns(Promise.resolve(Result.ok(stubEntity)));
      //Act
      await controller().handlePatch(stubRequest, stubResponse, stubServiceFunction);
      //Assert
      expect(stubServiceFunction).to.have.been.calledOnceWithExactly(
        stubRequest.params.id,
        stubRequest.body
      );
    });

    it(`When update fails, expect 500 status code.`, async function () {
      //Arrange
      const stubRequest = stubInterface<Request>();
      const stubResponse = stubInterface<Response>();
      stubResponse.json.returns(stubResponse);
      stubResponse.status.returns(stubResponse);

      const stubServiceFunction: ServiceFunction = sinon.stub();
      stubServiceFunction.returns(Promise.resolve(Result.error(AppError.empty)));

      //Act
      await controller().handlePatch(stubRequest, stubResponse, stubServiceFunction);

      //Assert
      expect(stubResponse.status).to.have.been.calledOnceWithExactly(500);
    });

    it(`When update fails, expect 500 status code and error with message and code in response body.`, async function () {
      //Arrange
      stubServiceFunction.resolves(Result.error(AppError.withCode(500)));
      //Act
      await controller().handlePatch(stubRequest, stubResponse, stubServiceFunction);
      //Assert
      const expectedResponseBody = {
        error: {
          code: ErrorCode.UNKOWN_ERROR,
          message: ErrorMessage.UnkownError,
        },
      };
      expect(stubResponse.json).to.have.been.calledOnceWithExactly(
        expectedResponseBody
      );
      expect(stubResponse.status).to.have.been.calledOnceWithExactly(500);
    });
  });
});
