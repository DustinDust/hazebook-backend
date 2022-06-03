import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseType } from 'src/utils';
import { PostCreateParams } from './dto/PostCreateParams.dto';
import { PostFindParams } from './dto/PostFindParams.dto';
import { PostUpdateParams } from './dto/PostUpdateParams.dto';
import { PostService } from './post.service';

@Controller('api/post')
export class PostController {
  constructor(
    private prisma: PrismaService,
    private postService: PostService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('find')
  @UseGuards(JwtAccessAuthGuard)
  async findPosts(@Query() query: PostFindParams): Promise<ResponseType> {
    try {
      const data = await this.postService.findPost(query);
      return {
        data: data,
        success: true,
        message: `Found ${data.length} posts!`,
      };
    } catch (e) {
      console.log(e);
      return {
        data: e,
        message: 'Fail to execute query',
        success: false,
      };
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @UseGuards(JwtAccessAuthGuard)
  async createPost(
    @Body() body: PostCreateParams,
    @Req() req: any,
  ): Promise<ResponseType> {
    try {
      const userId = req.user.userId;
      const data = await this.postService.createPost(userId, body);
      return {
        data: data,
        success: true,
        message: 'Created',
      };
    } catch (e) {
      if (e instanceof ForbiddenException) {
        throw e;
      }
      return {
        data: e,
        success: false,
        message: 'Fail to create post',
      };
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('update')
  @UseGuards(JwtAccessAuthGuard)
  async updatePost(
    @Body() body: PostUpdateParams,
    @Req() req,
  ): Promise<ResponseType> {
    try {
      const userId = req.user.userId;
      const data = await this.postService.updatePost(userId, body);
      return {
        data: data,
        success: true,
        message: `Successfully update post with id of ${body.id}`,
      };
    } catch (e) {
      console.log(e);

      if (e instanceof ForbiddenException) {
        throw e;
      }
      return {
        data: e,
        success: false,
        message: 'Fail to update post',
      };
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<ResponseType> {
    try {
      const userId = req.user.userId;
      await this.postService.deletePost(userId, id);
      return {
        success: true,
        message: 'Success',
        data: undefined,
      };
    } catch (e) {
      console.log(e);
      if (e instanceof ForbiddenException) {
        throw e;
      }
      return {
        success: false,
        message: 'Failed',
        data: e,
      };
    }
  }
}
