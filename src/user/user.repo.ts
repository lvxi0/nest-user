import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./domain/entity/user";

@Injectable()
export class UserRepo {
  constructor(
    @InjectModel(User.name) readonly userModel: Model<UserDocument>,
  ) {}

  async findByUsername(username: string): Promise<User> {
    const doc = await this.userModel.findOne({ username: username });
    if (!doc) {
      return null;
    }
    return doc;
  }
}
