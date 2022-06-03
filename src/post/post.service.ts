import { ForbiddenException, Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostCreateParams } from './dto/PostCreateParams.dto';
import { PostFindParams } from './dto/PostFindParams.dto';
import { PostUpdateParams } from './dto/PostUpdateParams.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async findPost(findParams: PostFindParams): Promise<Post[]> {
    const hasKeys = Object.keys(findParams).length > 0 ? true : false;
    const posts = await this.prisma.post.findMany({
      where: {
        OR: hasKeys
          ? [
              { id: findParams.id },
              {
                user: {
                  OR: [
                    { id: findParams.userId },
                    { name: findParams.userName },
                  ],
                },
              },
              {
                text: { contains: findParams.text },
              },
              {
                AND: [
                  {
                    createdAt: {
                      lte: findParams.createdAtUpper,
                    },
                  },
                  {
                    createdAt: {
                      gte: findParams.createdAtLower,
                    },
                  },
                ],
              },
            ]
          : undefined,
      },
    });
    return posts;
  }

  async createPost(userId: number, createParam: PostCreateParams) {
    const posts = await this.prisma.post.create({
      data: {
        text: createParam.text,
        imgURL: createParam.imgURL,
        userId: userId,
      },
      select: {
        text: true,
        imgURL: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return posts;
  }

  async updatePost(userId: number, updateParams: PostUpdateParams) {
    if (!(await this.checkOwnership(userId, updateParams.id))) {
      throw new ForbiddenException(
        `User #${userId} can not modify post #${updateParams.id}`,
      );
    } else {
      const updatedPost = await this.prisma.post.update({
        where: {
          id: updateParams.id,
        },
        data: {
          imgURL: updateParams.imgURL,
          text: updateParams.text,
        },
      });
      return updatedPost;
    }
  }

  async deletePost(userId: number, id: number) {
    const isOwn = await this.checkOwnership(userId, id);
    if (!isOwn) {
      throw new ForbiddenException(
        `User #${userId} can not modify post #${id}`,
      );
    } else
      await this.prisma.post.delete({
        where: {
          id: id,
        },
      });
  }

  private async checkOwnership(userId: number, postId: number) {
    const _posts = await this.prisma.post.findMany({
      where: {
        userId: userId,
        id: postId,
      },
    });
    return _posts.length > 0;
  }
}
