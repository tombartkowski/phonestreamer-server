import defaultMapper from '../../core/mapper.default';
import { Mapper } from '../../core/mapper';
import { VirtualMachine } from './virtualMachine';
import VirtualMachineModel from './virtualMachineModel';

const virtualMachineMapper = (): Mapper<VirtualMachine> =>
  defaultMapper(VirtualMachine.create, VirtualMachineModel);

export default virtualMachineMapper;
