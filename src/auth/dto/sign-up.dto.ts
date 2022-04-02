import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignUpDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @Matches(/^([a-zA-Z]+\s?)+$/, {
    message: '$value is not a valid name',
  })
  name: string;
}
