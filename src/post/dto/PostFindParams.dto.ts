import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { parseDate, parseInt } from 'src/utils';

export class PostFindParams {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  text?: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  userId?: number;

  @Transform(({ value }) => parseDate(value))
  @IsDate()
  @IsOptional()
  createdAtLower?: Date;

  @Transform(({ value }) => parseDate(value))
  @IsDate()
  @IsOptional()
  createdAtUpper?: Date;

  @IsString()
  @IsOptional()
  userName?: string;
}
