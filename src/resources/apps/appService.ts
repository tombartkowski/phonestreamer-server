import { Repository } from '../../core/repository';
import { Result } from '../../core/resolve';
import { App } from './app';
import { MongooseQueryParser } from 'mongoose-query-parser';
import mkdirp from 'mkdirp';
import { nanoid } from 'nanoid';
import path from 'path';
import { UploadProgressSocket } from '../../../uploadProgressSocket';
import { UnzipService } from './unzipService';
import { FilesService } from './filesService';
import { StorageService } from './storageService';
import { AppError, ErrorType } from '../../core/AppError';
import { UploadAppError } from './uploadAppError';
import del from 'del';
import { RequestInput } from '../../core/controller';

const BaseStorageUrl = 'https://storage.googleapis.com/phone-streamer.appspot.com/';

export interface AppService {
  createApp: (body: any) => Promise<Result<App>>;
  findApps: (input: RequestInput) => Promise<Result<App[]>>;
  findAppById: (id: string, input: RequestInput) => Promise<Result<App>>;
  deleteApp: (id: string) => Promise<Result<App>>;
  patchApp: (id: string, body: any) => Promise<Result<App>>;
}

export type AppMetadata = {
  name: string;
  altName: string;
  bundleIdentifier: string;
  iconName?: string;
  version: string;
  buildNumber: string;
  supportedDevices: number[];
};

export default (
  appRepository: Repository<App>,
  uploadProgressSocket: UploadProgressSocket,
  unzipService: UnzipService,
  filesService: FilesService,
  storageService: StorageService
): AppService => {
  const parser = new MongooseQueryParser();

  const readMetadata = async (
    zipFilePath: string,
    tempDirectoryPath: string
  ): Promise<AppMetadata> => {
    const [plistFilePath, ..._rest] = await unzipService.unzipFilesContaining(
      'Info.plist',
      zipFilePath,
      tempDirectoryPath
    );
    return filesService.readPlistFile(plistFilePath);
  };

  const sendAsyncProgress = (
    user: string,
    startingProgress: number,
    endingProgress: number,
    frequency: number
  ): NodeJS.Timeout => {
    let progress = startingProgress;
    return setInterval(() => {
      if (progress < endingProgress) {
        progress++;
      }
      uploadProgressSocket.sendProgress(user, progress);
    }, Math.floor(Math.random() * frequency) + frequency);
  };

  return {
    createApp: async (body: any) => {
      const randomDirectoryName = nanoid(6);
      const tempDirectoryPath = './tmp/' + randomDirectoryName;
      try {
        const user = body.user;
        if (!user) {
          return Result.error(new AppError('No tester id.', ErrorType.USER));
        }
        await mkdirp(tempDirectoryPath);

        const appMetadata = await readMetadata(body.file.path, tempDirectoryPath);
        uploadProgressSocket.sendProgress(user, 51);

        let iconUrl =
          'https://storage.googleapis.com/phone-streamer.appspot.com/images/default.png';
        if (appMetadata.iconName) {
          const [iconPath, ..._rest] = await unzipService.unzipFilesContaining(
            appMetadata.iconName,
            body.file.path,
            tempDirectoryPath
          );
          uploadProgressSocket.sendProgress(user, 52);
          if (iconPath) {
            const iconFileName = path.basename(iconPath);
            const timer = sendAsyncProgress(user, 52, 60, 30);
            await storageService.upload(iconPath, 'images/' + iconFileName);
            clearInterval(timer);
            iconUrl = BaseStorageUrl + 'images/' + iconFileName;
          }
        }

        const bundleFileName = path.basename(body.file.path);
        const appBundleUrl = BaseStorageUrl + 'bundles/' + bundleFileName;

        const timer = sendAsyncProgress(user, 60, 99, 50);
        await storageService.upload(body.file.path, 'bundles/' + bundleFileName);
        clearInterval(timer);

        const input = { ...appMetadata, bundleUrl: appBundleUrl, iconUrl, user };
        const [app, error] = App.create(input);
        if (error) {
          return [null, error];
        }
        const result = await appRepository.save(app!);
        uploadProgressSocket.sendProgress(user, 100);
        return result;
      } catch (error) {
        if (error instanceof AppError) {
          return [null, error];
        } else {
          return [null, UploadAppError.unknown];
        }
      } finally {
        await del([`tmp/${randomDirectoryName}/**`], { dryRun: false });
        await del([`tmp/${randomDirectoryName}`], { dryRun: false });
        await del([`tmp/*.zip`], { dryRun: false });
      }
    },
    findApps: async (input: RequestInput) => {
      const query = parser.parse(input.query);
      query.filter = { user: input.params.userId, ...query.filter };
      return appRepository.find(query);
    },
    findAppById: async (id: string, input: RequestInput) =>
      appRepository.findById(id, parser.parse(input.query)),
    deleteApp: async (id: string) => appRepository.delete(id),
    patchApp: async (id: string, body: any) => appRepository.updateOne(id, body),
  };
};
