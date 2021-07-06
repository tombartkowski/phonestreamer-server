import { Readable } from 'stream';
import yauzl from 'yauzl';
import { FilesService } from './filesService';
import path from 'path';
import { UploadAppError } from './uploadAppError';

type FilePath = string;

export interface UnzipService {
  unzipFilesContaining: (
    phrase: string,
    zipFilePath: string,
    destinationDirectoryPath: string
  ) => Promise<FilePath[]>;
}

export const unzipService = (filesService: FilesService): UnzipService => {
  return {
    unzipFilesContaining: (phrase, zipFilePath, destinationDirectoryPath) => {
      return new Promise((resolve, reject) => {
        yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
          if (err || !zipfile) {
            reject(UploadAppError.unzip);
            return;
          }
          const streams: { stream: Readable; fileName: string }[] = [];
          zipfile.readEntry();
          zipfile.on('entry', entry => {
            if (/\/$/.test(entry.fileName)) {
              zipfile.readEntry();
            } else {
              const rootDir = entry.fileName.split('/')[0];
              if (rootDir && entry.fileName.startsWith(rootDir + '/' + phrase)) {
                zipfile.openReadStream(entry, async (error, readStream) => {
                  if (error || !readStream) {
                    reject(UploadAppError.unzip);
                    return;
                  }
                  streams.push({ stream: readStream, fileName: entry.fileName });
                  zipfile.readEntry();
                });
              } else {
                zipfile.readEntry();
              }
            }
          });
          zipfile.on('end', () => {
            Promise.all(
              streams.map(stream =>
                filesService.saveStreamToFile(
                  stream.stream,
                  `${destinationDirectoryPath}/${path.basename(stream.fileName)}`
                )
              )
            )
              .then(filePaths => {
                resolve(filePaths);
              })
              .catch(() => {
                reject(UploadAppError.saveToDisk);
              });
          });
        });
      });
    },
  };
};
