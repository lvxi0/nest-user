import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from './domain/entity/user';
import { UserService } from './user.service';
import { UserRepo } from './user.repo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],

  providers: [UserService, UserRepo],
  exports: [UserService],
})
export class UserModule {}
