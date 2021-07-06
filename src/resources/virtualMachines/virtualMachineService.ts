import { Repository } from '../../core/repository';
import { Result } from '../../core/resolve';
import { VirtualMachine } from './virtualMachine';
import { MongooseQueryParser, QueryOptions } from 'mongoose-query-parser';
import { RequestInput } from '../../core/controller';

export interface VirtualMachineService {
  createVirtualMachine: (body: any) => Promise<Result<VirtualMachine>>;
  findVirtualMachines: (input: RequestInput) => Promise<Result<VirtualMachine[]>>;
  findVirtualMachineById: (
    id: string,
    input: RequestInput
  ) => Promise<Result<VirtualMachine>>;
  deleteVirtualMachine: (id: string) => Promise<Result<VirtualMachine>>;
  patchVirtualMachine: (id: string, body: any) => Promise<Result<VirtualMachine>>;
}

export default (
  virtualMachineRepository: Repository<VirtualMachine>
): VirtualMachineService => {
  const parser = new MongooseQueryParser();
  return {
    createVirtualMachine: async (body: any) => {
      const [virtualMachine, error] = VirtualMachine.create(body);
      return virtualMachine !== null
        ? virtualMachineRepository.save(virtualMachine)
        : [null, error];
    },
    findVirtualMachines: async (input: RequestInput) =>
      virtualMachineRepository.find(parser.parse(input.query)),
    findVirtualMachineById: async (id: string, input: RequestInput) =>
      virtualMachineRepository.findById(id, parser.parse(input.query)),
    deleteVirtualMachine: async (id: string) => virtualMachineRepository.delete(id),
    patchVirtualMachine: async (id: string, body: any) =>
      virtualMachineRepository.updateOne(id, body),
  };
};
