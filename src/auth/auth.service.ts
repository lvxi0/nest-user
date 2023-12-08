import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn.dto';
import { UserService } from '../user/user.service';
import { AuthRepo } from './auth.repo';
import { Login } from './domain/entity/login';
import {
  AUTH_MAX_RETRY_TIMES,
  AUTH_RETRY_PERIOD_IN_MINUTES,
} from './constants';

@Injectable()
export class AuthService {
  logger: Logger;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authRepo: AuthRepo,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async signIn({ username, password }: SignInDto): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new NotFoundException('Username does not exist');
    const login = await this.authRepo.findByUserId(user.userId);
    if (!login) throw new NotFoundException('Login does not exist');
    if (login.isLocked) throw new ForbiddenException('User is locked');

    // match password
    const isMatched = await this.comparePasswords(password, user.password);
    if (!isMatched) {
      // add failed login log if not matched
      await this.addFailedLogin(login);
      throw new UnauthorizedException('Invalid Password');
    }

    // return token if password match
    const payload = { sub: user.userId, username: user.username };
    const assessToken = this.jwtService.sign(payload);
    return {
      assessToken,
    };
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<any> {
    return bcrypt
      .compare(password, hashedPassword)
      .then((isMatch: any) => {
        return !!isMatch;
      })
      .catch((err: any) => err);
  }

  async addFailedLogin(login: Login) {
    const newInvalidLoginTimestamps = [];
    const currentDate = new Date();

    // refresh current invalidLoginTimestamps list, only keep elements within 5 mins
    for (const invalidLoginTimestamp of login.invalidLoginTimestamps) {
      const invalidLoginDate = new Date(invalidLoginTimestamp);
      if (this.isWithin5Minutes(invalidLoginDate, currentDate)) {
        newInvalidLoginTimestamps.push(invalidLoginTimestamp);
      }
    }

    // insert current failed login timestamp
    newInvalidLoginTimestamps.push(currentDate.toISOString());
    login.invalidLoginTimestamps = newInvalidLoginTimestamps;

    if (newInvalidLoginTimestamps.length >= AUTH_MAX_RETRY_TIMES) {
      login.isLocked = true;
      login.lockedAt = currentDate.toISOString();
      await this.authRepo.updateByUserId(login.userId, login);
      throw new ForbiddenException('User is locked');
    }

    await this.authRepo.updateByUserId(login.userId, login);
  }

  isWithin5Minutes(date1: Date, date2: Date): boolean {
    const timestamp1 = date1.getTime();
    const timestamp2 = date2.getTime();

    const differenceInMilliseconds: number = timestamp2 - timestamp1;
    return (
      differenceInMilliseconds > 0 &&
      differenceInMilliseconds <= AUTH_RETRY_PERIOD_IN_MINUTES
    );
  }
}
