import defaultMapper from '../../core/mapper.default';
import { Mapper } from '../../core/mapper';
import { Simulator } from './simulator';
import SimulatorModel from './simulatorModel';

const simulatorMapper = (): Mapper<Simulator> =>
  defaultMapper(Simulator.create, SimulatorModel);

export default simulatorMapper;
