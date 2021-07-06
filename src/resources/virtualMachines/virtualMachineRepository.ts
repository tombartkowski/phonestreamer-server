import { Mapper } from '../../core/mapper';
import defaultRepository from '../../core/repository.default';
import { Repository } from '../../core/repository';
import { VirtualMachine } from './virtualMachine';
import VirtualMachineModel from './virtualMachineModel';

const virtualMachineRepository = (
  virtualMachineMapper: Mapper<VirtualMachine>
): Repository<VirtualMachine> => {
  return defaultRepository(VirtualMachineModel, virtualMachineMapper);
};

export default virtualMachineRepository;
