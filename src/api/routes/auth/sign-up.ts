import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/validate-request';
import AuthService from '../../../services/auth-service';
import { Logger } from 'winston';

const router = Router();

router.post(
  '/signUp',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const logger = Container.get<Logger>('logger');
    const { email, password } = req.body;
    logger.silly(`User: ${email} attempting to sign up`);
    const authService = Container.get(AuthService);
    try {
      const jwt = await authService.signUp({ email, password });
      req.session = { jwt };
      res.status(201).send();
    } catch (err) {
      logger.error(`Error signing up ${email}`, err);
      throw err;
    }
  }
);

export { router as signUpRouter };
