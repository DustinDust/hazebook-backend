import { IsInt, IsString } from 'class-validator';

export class CommentUpdateParams {
  @IsInt()
  id: number;

  @IsString()
  commentText: string;
}
