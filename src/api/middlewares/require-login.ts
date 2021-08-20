import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../../errors/not-authorized-error';
import { Container } from 'typedi';
import { Logger } from 'winston';

export const requireLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    const logger = Container.get<Logger>('logger');
    logger.warn(`API accessed without proper access key`);
    throw new NotAuthorizedError();
  }
  next();
};
