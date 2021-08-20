import { Service, Inject } from 'typedi';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { Logger } from 'winston';

const scryptAsync = promisify(scrypt);

const pepper = process.env.PEPPER;

@Service()
export default class PasswordService {
  constructor(@Inject('logger') private logger: Logger) {}

  toHash = async (password: string) => {
    const salt = randomBytes(8).toString('hex');
    const buffer = (await scryptAsync(
      `${pepper}${password}`,
      salt,
      64
    )) as Buffer;

    return `${buffer.toString('hex')}.${salt}`;
  };

  compare = async (storedPassword: string, suppliedPassword: string) => {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buffer = (await scryptAsync(
      `${pepper}${suppliedPassword}`,
      salt,
      64
    )) as Buffer;

    return buffer.toString('hex') === hashedPassword;
  };
}
