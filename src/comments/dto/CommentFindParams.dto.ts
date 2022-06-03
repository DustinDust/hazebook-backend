import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { parseInt } from 'src/utils';

export class CommentFindParams {
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  id?: number;

  @IsString()
  @IsOptional()
  commentText?: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  userId?: number;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  postId?: number;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  parentId?: number;
}
