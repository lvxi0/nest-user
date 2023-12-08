import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './constants';
import { MongooseModule } from '@nestjs/mongoose';
import { Login, LoginSchema } from './domain/entity/login';
import { AuthRepo } from './auth.repo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Login.name, schema: LoginSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    forwardRef(() => UserModule),
  ],

  controllers: [AuthController],
  providers: [AuthService, AuthRepo],
  exports: [AuthService],
})
export class AuthModule {}
