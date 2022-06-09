import { Module } from '@nestjs/common';
import { UserLikePostController } from './UserLikePost.controller';
import { UserLikePostService } from './UserLikePost.service';

@Module({
  providers: [UserLikePostService],
  exports: [UserLikePostService],
  controllers: [UserLikePostController],
})
export class UserLikePostModule {}
