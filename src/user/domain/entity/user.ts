import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsUUID, isString } from 'class-validator';
import { Document } from 'mongoose';

@Schema({ collection: 'users' })
export class User {
  @Prop({ unique: true })
  @IsUUID('5')
  userId: string;

  @Prop({ unique: true })
  @IsString()
  username: string;

  @Prop()
  @IsString()
  password: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
