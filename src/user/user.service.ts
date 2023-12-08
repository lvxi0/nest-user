import { Injectable, Logger } from '@nestjs/common';
import { User } from './domain/entity/user';
import { UserRepo } from './user.repo';

@Injectable()
export class UserService {
  logger: Logger;
  constructor(private readonly userRepo: UserRepo) {
    this.logger = new Logger(UserService.name);
  }
  async findByUsername(username: string): Promise<User> {
    return this.userRepo.findByUsername(username);
  }
}
