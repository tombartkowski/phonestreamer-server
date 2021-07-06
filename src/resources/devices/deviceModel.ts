import { model, Schema } from 'mongoose';
import { handleDuplicatedKey } from '../../infra/mongoose/middleware/errorHandler';

const deviceSchema: Schema = new Schema({
  modelName: {
    type: String,
    required: true,
  },
  operatingSystemType: {
    type: String,
    required: true,
  },
  operatingSystemVersionNumber: {
    type: String,
    required: true,
  },
  typeIdentifier: {
    type: String,
    required: true,
  },
  previewImageUrl: {
    type: String,
  },
});

deviceSchema.post('save', handleDuplicatedKey);
deviceSchema.post('update', handleDuplicatedKey);
deviceSchema.post('findOneAndUpdate', handleDuplicatedKey);
deviceSchema.post('insertMany', handleDuplicatedKey);

export default model('Device', deviceSchema);
module.exports = model('Device', deviceSchema);
