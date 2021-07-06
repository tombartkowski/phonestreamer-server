import { model, Schema } from 'mongoose';
import { handleDuplicatedKey } from '../../infra/mongoose/middleware/errorHandler';

const virtualMachineSchema: Schema = new Schema({
  remoteUrl: {
    type: String,
    required: true,
  },
});

virtualMachineSchema.post('save', handleDuplicatedKey);
virtualMachineSchema.post('update', handleDuplicatedKey);
virtualMachineSchema.post('findOneAndUpdate', handleDuplicatedKey);
virtualMachineSchema.post('insertMany', handleDuplicatedKey);

export default model('VirtualMachine', virtualMachineSchema);
