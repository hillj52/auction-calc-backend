import 'express-async-errors';
import { Application } from 'express';
import helmet from 'helmet';
import { json } from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';
import { appRouter } from '../api/routes';
import config from '../config';
import { errorHandler } from '../api/middlewares/error-handler';

export default ({ app }: { app: Application }) => {
  app.set('trust proxy', true);
  app.use(helmet());
  app.use(json());
  app.use(cors());
  app.use(
    cookieSession({
      signed: false,
      secure: process.env.NODE_ENV === 'production',
    })
  );
  app.use(config.api.prefix, appRouter);
  app.use(errorHandler);
};
