import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class PostUpdateParams {
  @IsInt()
  id: number;

  @IsString()
  @IsOptional()
  text?: string;

  @IsUrl()
  @IsOptional()
  imgURL?: string;
}
