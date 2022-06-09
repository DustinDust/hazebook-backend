import { Injectable } from '@nestjs/common';
import { User, UserLikePost } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserLikePostService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find all users who like a specific post
   * @param postId Id of the post
   * @returns List of users who like the post
   */
  async getUser(postId: number): Promise<User[]> {
    const res = await this.prisma.userLikePost.findMany({
      where: {
        postId: postId,
      },
      select: {
        post: false,
        user: true,
      },
    });
    return res.map((ob) => {
      delete ob.user.hashedRT;
      delete ob.user.hash;
      return ob.user;
    });
  }

  /**
   *  Find All post which a certain user liked
   * @param userId Id of the user in question
   * @returns List of liked post
   */
  async getLikedPost(userId: number) {
    const res = await this.prisma.userLikePost.findMany({
      where: {
        userId: userId,
      },
      select: {
        post: {
          select: {
            id: true,
            text: true,
            imgURL: true,
            createdAt: true,
          },
        },
      },
    });
    return res;
  }

  async likePost(userId: number, postId: number): Promise<UserLikePost> {
    return await this.prisma.userLikePost.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });
  }

  async unlikePost(userId: number, postId: number) {
    await this.prisma.userLikePost.delete({
      where: {
        postId_userId: {
          postId: postId,
          userId: userId,
        },
      },
    });
  }
}
