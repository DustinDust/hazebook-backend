import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ResponseType } from 'src/utils';
import { CommentService } from './comment.service';
import { CommentFindParams } from './dto/CommentFindParams.dto';
import { CommentCreateParams } from './dto/CommentCreateParams.dto';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommentUpdateParams } from './dto/CommentUpdateParams.dto';

@Controller('api/comment')
export class CommentController {
  private readonly logger = new Logger(CommentController.name);
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
      this.logger.error(e.message);
      return {
        data: null,
        message: e.message,
        success: false,
      };
    }
  }

  @Post('create')
  @UseGuards(JwtAccessAuthGuard)
  async createComment(
    @Body() body: CommentCreateParams,
    @Req() req: any,
  ): Promise<ResponseType> {
    try {
      const data = body;
      data.userId = req.user.userId;
      console.log(data);
      const createdComment = await this.commentService.createComment(body);
      return {
        data: createdComment,
        success: true,
        message: 'Success',
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        success: false,
        message: 'Failed to create message',
        data: e,
      };
    }
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('update')
  async updateComment(
    @Req() req,
    @Body() updateParams: CommentUpdateParams,
  ): Promise<ResponseType> {
    try {
      const userId = req.user.userId;
      const updated = await this.commentService.updateComment(
        userId,
        updateParams,
      );
      return {
        success: true,
        message: 'Updated successfully',
        data: updated,
      };
    } catch (ex) {
      this.logger.error(ex.message);
      if (ex instanceof ForbiddenException) {
        throw ex;
      }
    }
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('delete/:id')
  async deleteComment(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req,
  ): Promise<ResponseType> {
    try {
      const userId = req.user.userId;
      await this.commentService.deleteComment(userId, id);
      return {
        success: true,
        message: 'Successfully deleted',
        data: null,
      };
    } catch (ex) {
      this.logger.error(ex.message);
      if (ex instanceof ForbiddenException) {
        throw ex;
      }
    }
  }
}
