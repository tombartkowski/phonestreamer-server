import { Repository } from '../../core/repository';
import { Result } from '../../core/resolve';
import { Simulator } from './simulator';
import { MongooseQueryParser, QueryOptions } from 'mongoose-query-parser';
import { RequestInput } from '../../core/controller';

export interface SimulatorService {
  createSimulator: (body: any) => Promise<Result<Simulator>>;
  findSimulators: (input: RequestInput) => Promise<Result<Simulator[]>>;
  findSimulatorById: (id: string, input: RequestInput) => Promise<Result<Simulator>>;
  deleteSimulator: (id: string) => Promise<Result<Simulator>>;
  patchSimulator: (id: string, body: any) => Promise<Result<Simulator>>;
}

export default (simulatorRepository: Repository<Simulator>): SimulatorService => {
  const parser = new MongooseQueryParser();
  return {
    createSimulator: async (body: any) => {
      const [simulator, error] = Simulator.create(body);
      return simulator !== null
        ? simulatorRepository.save(simulator)
        : [null, error];
    },
    findSimulators: async (input: RequestInput) =>
      simulatorRepository.find(parser.parse(input.query)),
    findSimulatorById: async (id: string, input: RequestInput) =>
      simulatorRepository.findById(id, parser.parse(input.query)),
    deleteSimulator: async (id: string) => simulatorRepository.delete(id),
    patchSimulator: async (id: string, body: any) =>
      simulatorRepository.updateOne(id, body),
  };
};
