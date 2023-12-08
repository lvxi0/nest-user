import { Injectable, NotFoundException } from '@nestjs/common';
import { Login, LoginDocument } from './domain/entity/login';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthRepo {
  constructor(
    @InjectModel(Login.name) readonly loginModel: Model<LoginDocument>,
  ) {}

  async findByUserId(userId: string): Promise<Login> {
    const doc = await this.loginModel.findOne({ userId: userId });
    if (!doc) {
      return null;
    }

    return doc;
  }

  async updateByUserId(userId: string, login: Login): Promise<Login> {
    const doc = await this.loginModel.findOneAndUpdate(
      { userId: userId },
      login,
      { returnOriginal: false },
    );
    if (!doc) {
      throw new NotFoundException(`Login #${userId} not found`);
    }

    return doc;
  }
}
