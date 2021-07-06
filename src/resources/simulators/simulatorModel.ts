import { model, Schema } from 'mongoose';
import { handleDuplicatedKey } from '../../infra/mongoose/middleware/errorHandler';

const simulatorSchema: Schema = new Schema({
  identifier: {
    type: String,
    required: true,
  },
  device: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Device',
  },
  virtualMachine: {
    type: Schema.Types.ObjectId,
    ref: 'VirtualMachine',
  },
});

simulatorSchema.post('save', handleDuplicatedKey);
simulatorSchema.post('update', handleDuplicatedKey);
simulatorSchema.post('findOneAndUpdate', handleDuplicatedKey);
simulatorSchema.post('insertMany', handleDuplicatedKey);

export default model('Simulator', simulatorSchema);
