import defaultMapper from '../../core/mapper.default';
import { Mapper } from '../../core/mapper';
import { Device } from './device';
import DeviceModel from './deviceModel';

const deviceMapper = (): Mapper<Device> => defaultMapper(Device.create, DeviceModel);
export default deviceMapper;
