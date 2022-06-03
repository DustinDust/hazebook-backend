import { IsOptional, IsString, IsUrl } from 'class-validator';

export class PostCreateParams {
  @IsString()
  text: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  imgURL?: string;
}
