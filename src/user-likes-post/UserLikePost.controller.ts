import {
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseType } from 'src/utils';
import { UserLikePost } from './dto/UserLikePost.dto';
import { UserLikePostService } from './UserLikePost.service';

@Controller('api/user-like-post')
export class UserLikePostController {
  private readonly logger = new Logger(UserLikePostController.name);
  constructor(private userLikePostService: UserLikePostService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessAuthGuard)
  @Post('like/:id')
  async likePost(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<ResponseType> {
    try {
      const likeParam: UserLikePost = {
        postId: id,
        userId: req.user.userId,
      };
      const info = await this.userLikePostService.likePost(
        likeParam.userId,
        likeParam.postId,
      );
      return {
        success: true,
        data: info,
        message: 'Post liked',
      };
    } catch (ex) {
      this.logger.error(ex.message);
      return {
        success: false,
        data: null,
        message: ex.message,
      };
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessAuthGuard)
  @Post('unlike/:id')
  async unlikePost(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseType> {
    try {
      await this.userLikePostService.unlikePost(req.user.userId, id);
      return {
        success: true,
        data: undefined,
        message: 'Post unliked',
      };
    } catch (ex) {
      if (
        ex instanceof Prisma.PrismaClientKnownRequestError &&
        ex.code === 'P2025'
      ) {
        return {
          success: false,
          message: 'You have not liked the post',
          data: undefined,
        };
      }
      this.logger.error(ex.message);
    }
  }
}
