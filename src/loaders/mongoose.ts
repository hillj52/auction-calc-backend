import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../config';

export default async (): Promise<Db> => {
  const { URI, username, password } = config.database;
  const connection = await mongoose.connect(URI, {
    auth: {
      user: username,
      password,
    },
    authSource: 'admin',
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  return connection.connection.db;
};
