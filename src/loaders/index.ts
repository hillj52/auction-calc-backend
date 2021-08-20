import { Application } from 'express';
import expressLoader from './express';
import dependencyInjectionLoader from './dependency-injector';
import mongooseLoader from './mongoose';
import Logger from './logger';

export default async ({ app }: { app: Application }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const userModel = {
    name: 'userModel',
    model: require('../models/user').default,
  };

  const playerModel = {
    name: 'playerModel',
    model: require('../models/player').default,
  };

  const teamModel = {
    name: 'teamModel',
    model: require('../models/team').default,
  };

  dependencyInjectionLoader({
    models: [userModel, playerModel, teamModel],
  });
  Logger.info('✌️ Dependency Injector loaded!');

  expressLoader({ app });
  Logger.info('✌️ Express loaded!');
};
