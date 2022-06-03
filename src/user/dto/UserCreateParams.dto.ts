import { IsEmail, IsString } from 'class-validator';

export class UserCreateParams {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  hash: string;
}
