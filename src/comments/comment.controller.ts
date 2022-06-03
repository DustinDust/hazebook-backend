import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ResponseType } from 'src/utils';
import { CommentService } from './comment.service';
import { CommentFindParams } from './dto/CommentFindParams.dto';
import { CommentCreateParams } from './dto/CommentCreateParams.dto';

@Controller('api/comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('find')
  async findComments(@Query() query: CommentFindParams): Promise<ResponseType> {
    try {
      const comments = await this.commentService.findComment(query);
      return {
        data: comments,
        message: 'Success',
        success: true,
      };
    } catch (e) {
      return {
        data: null,
        message: e.message,
        success: false,
      };
    }
  }

  @Post('create')
  async createComment(
    @Body() body: CommentCreateParams,
  ): Promise<ResponseType> {
    try {
      const createdComment = this.commentService.createComment(body);
      return {
        data: createdComment,
        success: true,
        message: 'Success',
      };
    } catch (e) {
      return {
        success: false,
        message: 'Failed to create message',
        data: e,
      };
    }
  }
}
