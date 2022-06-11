import { Module } from '@nestjs/common';
import { FriendController } from './Friend.controller';
import { FriendService } from './Friend.service';
import { FriendRequestService } from './FriendRequest.service';

@Module({
  controllers: [FriendController],
  exports: [FriendService],
  providers: [FriendService, FriendRequestService],
})
export class FriendModule {}
