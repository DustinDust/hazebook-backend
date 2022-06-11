import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseType } from 'src/utils';
import { FriendService } from './Friend.service';
import { FriendRequestService } from './FriendRequest.service';

@Controller('api/friend')
export class FriendController {
  private readonly logger = new Logger(FriendController.name);
  constructor(
    private friendService: FriendService,
    private friendRequestService: FriendRequestService,
  ) {}

  @Get('list')
  @UseGuards(JwtAccessAuthGuard)
  async getListFriend(@Req() req: any): Promise<ResponseType> {
    try {
      const data = await this.friendService.getFriendList(req.user.userId);
      return {
        success: true,
        message: 'Friend list found',
        data: data,
      };
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('request')
  async sendFriendRequest(
    @Body() body: { friendId: number },
    @Req() req: any,
  ): Promise<ResponseType> {
    try {
      const data = await this.friendRequestService.sendFriendRequest(
        req.user.userId,
        body.friendId,
      );
      return {
        success: true,
        message: 'Request sent',
        data: data,
      };
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  @Post('accept')
  @UseGuards(JwtAccessAuthGuard)
  async acceptFriendRequest(
    @Body() body: { friendId: number },
    @Req() req: any,
  ): Promise<ResponseType> {
    try {
      const data = await this.friendRequestService.acceptFriendRequest(
        body.friendId,
        req.user.userId,
      );
      return {
        success: true,
        message: 'Request Accepted',
        data: data,
      };
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  @Post('reject')
  @UseGuards(JwtAccessAuthGuard)
  async rejectFriendRequest(
    @Body() body: { friendId: number },
    @Req() req: any,
  ): Promise<ResponseType> {
    try {
      const data = await this.friendRequestService.rejectFriendRequest(
        req.user.userId,
        body.friendId,
      );
      return {
        success: true,
        message: 'Rejected',
        data: data,
      };
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  @Post('unfriend/:id')
  @UseGuards(JwtAccessAuthGuard)
  async unfriend(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<ResponseType> {
    try {
      const data = await this.friendService.unfriend(req.user.userId, id);
      return {
        success: true,
        message: 'Friend Deleted',
        data: data,
      };
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  @Get('requests-received')
  @UseGuards(JwtAccessAuthGuard)
  async getRequestList(@Req() req: any): Promise<ResponseType> {
    try {
      const data = await this.friendRequestService.getRequestList(
        req.user.userId,
      );
      return {
        success: true,
        message: 'Received',
        data: data,
      };
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  @Get('requests-sent')
  @UseGuards(JwtAccessAuthGuard)
  async getRequestSent(@Req() req: any): Promise<ResponseType> {
    try {
      const data = await this.friendRequestService.getRequestSent(
        req.user.userId,
      );
      return {
        success: true,
        message: 'Sent',
        data: data,
      };
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  @Get('recommend-friend')
  @UseGuards(JwtAccessAuthGuard)
  async getRecommendation(@Req() req: any): Promise<ResponseType> {
    try {
      const data = await this.friendService.getFriendRecommendation(
        req.user.userId,
      );
      return { success: true, message: 'People you might know', data: data };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
