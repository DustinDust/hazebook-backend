import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentFindParams } from './dto/CommentFindParams.dto';
import { CommentCreateParams } from './dto/CommentCreateParams.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async findComment(findParams: CommentFindParams) {
    const hasKeys = Object.keys(findParams).length > 0;

    const data = await this.prisma.comment.findMany({
      where: {
        OR: hasKeys
          ? [
              { id: findParams.id },
              { commentText: { contains: findParams.commentText } },
              { parentId: findParams.parentId },
              { postId: findParams.postId },
              { userId: findParams.userId },
            ]
          : undefined,
      },
      select: {
        id: true,
        child: {
          select: {
            id: true,
          },
        },
        post: {
          select: {
            id: true,
          },
        },
        user: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    return data;
  }

  async createComment(createParams: CommentCreateParams) {
    const data = await this.prisma.comment.create({
      data: {
        postId: createParams.postId,
        userId: createParams.userId,
        commentText: createParams.commentText,
        parentId: createParams.parentId,
      },
      select: {
        id: true,
        commentText: true,
        parentId: true,
        postId: true,
        userId: true,
      },
    });
    return data;
  }
}
