import { Readable } from 'stream';
import { AppMetadata } from './appService';
const plist = require('simple-plist');
import fs from 'fs';
import { UploadAppError } from './uploadAppError';

type FilePath = string;

export interface FilesService {
  saveStreamToFile: (stream: Readable, newFilePath: string) => Promise<FilePath>;
  readPlistFile: (path: string) => Promise<AppMetadata>;
}

export const filesService = (): FilesService => {
  return {
    saveStreamToFile: (stream, newFilePath) => {
      return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(newFilePath);
        stream.pipe(writeStream);
        writeStream.on('finish', () => {
          resolve(newFilePath);
        });
        writeStream.on('error', error => {
          reject(UploadAppError.saveToDisk);
        });
      });
    },
    readPlistFile: path => {
      return new Promise((resolve, reject) => {
        plist.readFile(path, (error: Error, data: unknown) => {
          if (error) {
            reject(UploadAppError.readPlist);
            return;
          }
          try {
            const plist: any = data;
            const bundleIcons = plist['CFBundleIcons'];
            const primaryIcon = bundleIcons && bundleIcons['CFBundlePrimaryIcon'];
            const iconName = primaryIcon && primaryIcon['CFBundleIconName'];

            const appInfo = {
              name: plist['CFBundleName'],
              altName: plist['CFBundleExecutable'],
              bundleIdentifier: plist['CFBundleIdentifier'],
              iconName,
              version: plist['CFBundleShortVersionString'],
              buildNumber: plist['CFBundleVersion'],
              supportedDevices: plist['UIDeviceFamily'],
            };
            resolve(appInfo);
          } catch (_error) {
            reject(UploadAppError.readPlist);
          }
        });
      });
    },
  };
};
