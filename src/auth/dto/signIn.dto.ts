import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{5,32}$/, {
    message:
      'Must contain at least one uppercase letter, one lowercase letter, ' +
      'and only use letters and numbers. Length must be between 5 and 32 characters.',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[_\-\+])[a-zA-Z0-9_\-\+]{8,32}$/, {
    message:
      'Must contain at least one uppercase letter, one lowercase letter, ' +
      'and one of the characters (_,-,+). Only use letters, numbers, and ' +
      'the specified characters. Length must be between 8 and 32 characters.',
  })
  password: string;
}
