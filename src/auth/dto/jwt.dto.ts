import { IsInt } from 'class-validator';

export class JwtDTO {
  @IsInt()
  userId: number;

  @IsInt()
  iat: number;

  @IsInt()
  exp: number;
}
