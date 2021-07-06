import { model, Schema } from 'mongoose';
import { handleDuplicatedKey } from '../../infra/mongoose/middleware/errorHandler';

const sessionSchema: Schema = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true,
  },
  simulator: {
    type: Schema.Types.ObjectId,
    ref: 'Simulator',
    required: true,
  },
  virtualMachine: {
    type: Schema.Types.ObjectId,
    ref: 'VirtualMachine',
    required: true,
  },
  startedOn: {
    type: Date,
    default: Date.now,
  },
});

sessionSchema.post('save', handleDuplicatedKey);
sessionSchema.post('update', handleDuplicatedKey);
sessionSchema.post('findOneAndUpdate', handleDuplicatedKey);
sessionSchema.post('insertMany', handleDuplicatedKey);

export default model('Session', sessionSchema);
