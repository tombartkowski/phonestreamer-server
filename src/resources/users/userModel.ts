import { model, Schema } from 'mongoose';
import { handleDuplicatedKey } from '../../infra/mongoose/middleware/errorHandler';

const userSchema: Schema = new Schema({
  firebaseId: String,
  email: String,
  signupMethod: String,
  joinedDate: {
    type: Date,
    default: Date.now,
  },
});

userSchema.post('save', handleDuplicatedKey);
userSchema.post('update', handleDuplicatedKey);
userSchema.post('findOneAndUpdate', handleDuplicatedKey);
userSchema.post('insertMany', handleDuplicatedKey);

export default model('User', userSchema);
