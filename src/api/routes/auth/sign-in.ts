import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Container } from 'typedi';
import AuthService from '../../../services/auth-service';
import { Logger } from 'winston';
import { validateRequest } from '../../middlewares/validate-request';

const router = Router();

router.post(
  '/signIn',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must provide a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const logger = Container.get<Logger>('logger');
    const { email, password } = req.body;
    logger.silly(`User: ${email} attempting to sign in`);
    const authService = Container.get(AuthService);
    try {
      const jwt = await authService.signIn({ email, password });
      req.session = { jwt };
      res.status(200).send(jwt);
    } catch (err) {
      logger.error(`Error logging in ${email}`, err);
      throw err;
    }
  }
);

export { router as signInRouter };
