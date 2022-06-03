import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { parseInt } from 'src/utils';

export class CommentCreateParams {
  @IsString()
  commentText: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  parentId?: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  postId: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  userId: number;
}
