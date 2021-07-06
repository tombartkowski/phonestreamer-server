import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { ErrorCode } from '../../core/AppError';
import { App } from './app';
import appService, { AppMetadata } from './appService';
import { Repository } from '../../core/repository';
import { stubInterface, stubObject } from 'ts-sinon';
import { Result } from '../../core/resolve';
import { QueryOptions } from 'mongoose-query-parser';
import faker from 'faker';
import { Types } from 'mongoose';
import { filesService, FilesService } from './filesService';
import { storageService, StorageService } from './storageService';
import { UnzipService } from './unzipService';
import { UploadProgressSocket } from '../../../uploadProgressSocket';
import { nanoid } from 'nanoid';
import { UploadResponse } from '@google-cloud/storage/build/src';
import path from 'path';

chai.use(sinonChai);

describe('AppService', function () {
  const stubRepository = stubInterface<Repository<App>>();
  const stubFilesService = stubInterface<FilesService>();
  const stubStorageService = stubInterface<StorageService>();
  const stubUnzipService = stubInterface<UnzipService>();
  const stubUploadProgressSocket = stubInterface<UploadProgressSocket>();
  let stubMetadata = stubObject<AppMetadata>({
    name: faker.company.companyName(),
    altName: faker.company.companyName(),
    bundleIdentifier: 'com.bundle.identifier',
    version: '1.0.0',
    buildNumber: '5',
    supportedDevices: [1, 2],
  });

  const service = appService(
    stubRepository,
    stubUploadProgressSocket,
    stubUnzipService,
    stubFilesService,
    stubStorageService
  );

  const makeValidInput = () => ({
    file: { path: faker.system.filePath() },
    testerId: faker.datatype.uuid(),
  });

  const makeApp = (): App => {
    const [app] = App.create({
      shortId: faker.datatype.string(10),
      name: faker.company.companyName(),
      altName: faker.company.companyName(),
      bundleIdentifier: 'com.bundle.identifier',
      iconUrl: faker.internet.url(),
      version: '1.0.0',
      buildNumber: faker.datatype.number(),
      bundleUrl: faker.internet.url(),
      supportedDevices: [1, 2],
      _id: new Types.ObjectId(),
    });
    return app!;
  };

  beforeEach(function () {
    stubRepository.save.resetHistory();
    stubRepository.findById.resetHistory();
    stubRepository.find.resetHistory();
    stubRepository.delete.resetHistory();
    stubRepository.updateOne.resetHistory();
    stubRepository.save.callsFake(entity => {
      entity.id = new Types.ObjectId();
      return Promise.resolve(Result.ok(entity));
    });
    const entity = makeApp();
    stubRepository.findById.resolves(Result.ok(entity));
    stubRepository.find.resolves(Result.ok([entity]));

    stubFilesService.readPlistFile.reset();
    stubMetadata = stubObject<AppMetadata>({
      name: faker.company.companyName(),
      altName: faker.company.companyName(),
      iconName: 'AppIcon',
      bundleIdentifier: 'com.bundle.identifier',
      version: '1.0.0',
      buildNumber: '5',
      supportedDevices: [1, 2],
    });
    stubFilesService.readPlistFile.resolves(stubMetadata);

    stubFilesService.saveStreamToFile.reset();
    stubFilesService.saveStreamToFile.resolves(faker.system.filePath());
    stubStorageService.upload.reset();
    stubStorageService.upload.resolves(stubInterface<UploadResponse>());
    stubUnzipService.unzipFilesContaining.reset();
    stubUnzipService.unzipFilesContaining.callsFake((phrase, _path, _dest) => {
      return Promise.resolve([phrase]);
    });
  });

  describe('#createApp', function () {
    it(`when creating with valid body, expect created App.`, async function () {
      //Arrange
      const body = makeValidInput();
      //Act
      const [app] = await service.createApp(body);
      //Assert
      expect(app).to.be.an.instanceOf(App);
    });

    it(`when creating with valid body, expect reading metadata from zip file.`, async function () {
      //Arrange
      const body = makeValidInput();
      //Act
      await service.createApp(body);
      //Assert
      expect(stubUnzipService.unzipFilesContaining).to.be.calledWith('Info.plist', body.file.path);
      expect(stubFilesService.readPlistFile).to.be.calledOnce;
    });

    it(`when creating with valid body, expect the icon image to be unzipped and saved on disk.`, async function () {
      //Arrange
      const body = makeValidInput();
      //Act
      await service.createApp(body);
      //Assert
      expect(stubUnzipService.unzipFilesContaining).to.be.calledWith(
        stubMetadata.iconName,
        body.file.path
      );
    });

    it(`when creating with valid body, expect the icon image to be uploaded to the cloud.`, async function () {
      //Arrange
      const body = makeValidInput();
      //Act
      await service.createApp(body);
      //Assert
      expect(stubStorageService.upload.firstCall).to.be.calledWith(
        stubMetadata.iconName,
        'images/' + stubMetadata.iconName
      );
    });

    it(`when creating with valid body, expect the zip file to be uploaded to the cloud.`, async function () {
      //Arrange
      const body = makeValidInput();
      //Act
      await service.createApp(body);
      //Assert
      expect(stubStorageService.upload.secondCall).to.be.calledWith(
        body.file.path,
        'bundles/' + path.basename(body.file.path)
      );
    });

    it(`when creating with valid body, expect the upload progress socket to be updated multiple times.`, async function () {
      //Arrange
      const body = makeValidInput();
      //Act
      await service.createApp(body);
      //Assert
      expect(stubUploadProgressSocket.sendProgress).callCount;
    });
  });

  describe('#findSessions', function () {
    it(`when finding with a query, expect calling repository with it.`, async function () {
      //Arrange
      const stubQuery = stubInterface<QueryOptions>();
      //Act
      await service.findApps(stubQuery);
      //Assert
      expect(stubRepository.find).to.have.been.calledWith(stubQuery);
    });
  });

  describe('#findAppById', function () {
    it(`when finding with an id and query, expect calling repository with both.`, async function () {
      //Arrange
      const stubQuery = stubInterface<QueryOptions>();
      const id = new Types.ObjectId().toHexString();
      //Act
      await service.findAppById(id, stubQuery);
      //Assert
      expect(stubRepository.findById).to.have.been.calledWith(id, stubQuery);
    });
  });

  describe('#deleteApp', function () {
    it(`when deleting with an id, expect calling repository with it.`, async function () {
      //Arrange
      const id = new Types.ObjectId().toHexString();
      //Act
      await service.deleteApp(id);
      //Assert
      expect(stubRepository.delete).to.have.been.calledWith(id);
    });
  });

  describe('#patchApp', function () {
    it(`when updating with an id and a body, expect calling repository with both.`, async function () {
      //Arrange
      const body = {};
      const id = 'identifier';
      //Act
      await service.patchApp(id, body);
      //Assert
      expect(stubRepository.updateOne).to.have.been.calledWith(id, body);
    });
  });
});
