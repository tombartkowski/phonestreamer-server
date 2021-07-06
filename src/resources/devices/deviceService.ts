import { Repository } from '../../core/repository';
import { Result } from '../../core/resolve';
import { Device } from './device';
import { MongooseQueryParser, QueryOptions } from 'mongoose-query-parser';
import { RequestInput } from '../../core/controller';

export interface DeviceService {
  createDevice: (body: any) => Promise<Result<Device>>;
  findDevices: (input: RequestInput) => Promise<Result<Device[]>>;
  findDeviceById: (id: string, input: RequestInput) => Promise<Result<Device>>;
  deleteDevice: (id: string) => Promise<Result<Device>>;
  patchDevice: (id: string, body: any) => Promise<Result<Device>>;
}

export default (deviceRepository: Repository<Device>): DeviceService => {
  const parser = new MongooseQueryParser();

  return {
    createDevice: async (body: any) => {
      const [device, error] = Device.create(body);
      return device !== null ? deviceRepository.save(device) : [null, error];
    },
    findDevices: async (input: RequestInput) =>
      deviceRepository.find(parser.parse(input.query)),
    findDeviceById: async (id: string, input: RequestInput) =>
      deviceRepository.findById(id, parser.parse(input.query)),
    deleteDevice: async (id: string) => deviceRepository.delete(id),
    patchDevice: async (id: string, body: any) =>
      deviceRepository.updateOne(id, body),
  };
};
