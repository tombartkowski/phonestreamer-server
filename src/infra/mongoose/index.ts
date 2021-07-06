import mongoose from 'mongoose';

export default () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('No MongoDB connection URI found in .env file.');
  }
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log('📁[mongoDB]: Connected to MongoDB.');
    })
    .catch((error) => {
      console.log('📁[mongoDB]: Failed to connect to MongoDB. ' + error);
    });
};
