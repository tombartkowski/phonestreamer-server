import { Mapper } from '../../core/mapper';
import defaultRepository from '../../core/repository.default';
import { Repository } from '../../core/repository';
import { Simulator } from './simulator';
import SimulatorModel from './simulatorModel';

const simulatorRepository = (
  simulatorMapper: Mapper<Simulator>
): Repository<Simulator> => {
  return defaultRepository(SimulatorModel, simulatorMapper);
};

export default simulatorRepository;
