import admin from 'firebase-admin';
import { UploadResponse } from '@google-cloud/storage/build/src';
import { UploadAppError } from './uploadAppError';

export interface StorageService {
  upload: (filePath: string, destination: string) => Promise<UploadResponse>;
}

export const storageService = (): StorageService => {
  const bucket = admin.storage().bucket();
  return {
    upload: (filePath, destination) => {
      return new Promise((resolve, reject) => {
        bucket.upload(filePath, { destination }, (err, file, response) => {
          if (err || !file) {
            console.log(err);
            reject(UploadAppError.uploadToCloud);
            return;
          }
          resolve([file, response]);
        });
      });
    },
  };
};
