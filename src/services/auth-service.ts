import { Service, Inject, Container } from 'typedi';
import { Logger } from 'winston';
import { BadRequestError } from '../errors/bad-request-error';
import { UserAttributes } from '../interfaces/user';
import { UserModel } from '../models/user';
import JwtService from './jwt-service';
import PasswordService from './password-service';

@Service()
export default class AuthService {
  private passwordService: PasswordService;

  constructor(
    @Inject('userModel') private userModel: UserModel,
    @Inject('logger') private logger: Logger,
    @Inject('jwtService') private jwtService: JwtService
  ) {
    this.passwordService = Container.get(PasswordService);
  }

  public async signUp({ email, password }: UserAttributes) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      this.logger.silly(
        `Attempted to create user with email: ${email} already in use`
      );
      throw new BadRequestError('Email in use', 'email');
    }

    const user = this.userModel.build({ email, password });
    await user.save();

    return this.jwtService.generateToken({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });
  }

  public async signIn({ email, password }: UserAttributes) {
    const existingUser = await this.userModel.findOne({ email });
    if (!existingUser) {
      this.logger.silly(
        `Attempted to log in user with email: ${email} not in use`
      );
      throw new BadRequestError('Invalid Credentials');
    }
    const passwordsMatch = await this.passwordService.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      this.logger.silly(
        `Attempted to log in user with email: ${email} invalid password`
      );
      throw new BadRequestError('Invalid Credentials');
    }

    return this.jwtService.generateToken({
      id: existingUser.id,
      email: existingUser.email,
      roles: existingUser.roles,
    });
  }
}
