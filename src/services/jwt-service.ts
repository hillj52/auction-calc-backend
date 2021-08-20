import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import config from '../config';
import { User } from '../interfaces/user';
import jwt from 'jsonwebtoken';

@Service('jwtService')
export default class JwtService {
  constructor(@Inject('logger') private logger: Logger) {}

  generateToken(user: User) {
    this.logger.info(`Generating JWT for user ${user.id}`);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 10);
    return jwt.sign(
      {
        ...user,
        exp: expiresAt.getTime() / 1000,
      },
      config.JWT.key
    );
  }
}
