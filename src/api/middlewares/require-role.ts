import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { NotAuthorizedError } from '../../errors/not-authorized-error';
import { Logger } from 'winston';

export const requireRole =
  (role: string) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser || !req.currentUser.roles.includes(role)) {
      const logger = Container.get<Logger>('logger');
      logger.warn(
        `User ${req.currentUser} attempted to access restricted resource`
      );
      throw new NotAuthorizedError();
    }
    next();
  };
