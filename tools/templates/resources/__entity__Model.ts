import { model, Schema, Types } from 'mongoose';
import { handleDuplicatedKey } from '../../infra/mongoose/middleware/errorHandler';

const __entity__(camelCase)Schema: Schema = new Schema({
  
});

__entity__(camelCase)Schema.post('save', handleDuplicatedKey);
__entity__(camelCase)Schema.post('update', handleDuplicatedKey);
__entity__(camelCase)Schema.post('findOneAndUpdate', handleDuplicatedKey);
__entity__(camelCase)Schema.post('insertMany', handleDuplicatedKey);

export default model('__entity__', __entity__(camelCase)Schema);
