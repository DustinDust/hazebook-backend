import { IsEmail, IsString } from 'class-validator';

export class UserUpdateParams {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  profilePicURL: string;
}
