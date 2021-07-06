import { model, Schema, Types } from 'mongoose';
import { handleDuplicatedKey } from '../../infra/mongoose/middleware/errorHandler';

const appSchema: Schema = new Schema({
  name: String,
  shortId: {
    type: String,
    unique: true,
  },
  user: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  altName: String,
  bundleIdentifier: String,
  iconUrl: String,
  version: String,
  buildNumber: String,
  bundleUrl: String,
  supportedDevices: [Number],
});

appSchema.post('save', handleDuplicatedKey);
appSchema.post('update', handleDuplicatedKey);
appSchema.post('findOneAndUpdate', handleDuplicatedKey);
appSchema.post('insertMany', handleDuplicatedKey);

export default model('App', appSchema);
