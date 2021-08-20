import { Container } from 'typedi';
import LoggerInstance from './logger';
//import config from '../config';

export default ({ models }: { models: { name: string; model: any }[] }) => {
  try {
    models.forEach((model) => {
      Container.set(model.name, model.model);
    });

    Container.set('logger', LoggerInstance);
    LoggerInstance.info('Logger injected into container');
  } catch (err) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', err);
    throw err;
  }
};
