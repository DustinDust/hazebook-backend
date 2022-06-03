import { Module } from '@nestjs/common';
import { UserLikePostService } from './UserLikePost.service';

@Module({
  providers: [UserLikePostService],
  exports: [UserLikePostService],
})
export class UserLikePostModule {}
