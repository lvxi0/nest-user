import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsString, IsUUID } from 'class-validator';
import { Document } from 'mongoose';

@Schema({ collection: 'login' })
export class Login {
  @Prop()
  @IsUUID('5')
  userId: string;

  @Prop()
  @IsBoolean()
  isLocked: boolean;

  @Prop()
  @IsString()
  lockedAt: string;

  @Prop()
  invalidLoginTimestamps: string[];
}

export type LoginDocument = Login & Document;

export const LoginSchema = SchemaFactory.createForClass(Login);
