import { Mapper } from '../../core/mapper';
import defaultRepository from '../../core/repository.default';
import { Repository } from '../../core/repository';
import { Device } from './device';
import DeviceModel from './deviceModel';

const deviceRepository = (deviceMapper: Mapper<Device>): Repository<Device> => {
  return defaultRepository(DeviceModel, deviceMapper);
};

export default deviceRepository;
