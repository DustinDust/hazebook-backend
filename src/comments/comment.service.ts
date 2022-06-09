import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentFindParams } from './dto/CommentFindParams.dto';
import { CommentCreateParams } from './dto/CommentCreateParams.dto';
import { CommentUpdateParams } from './dto/CommentUpdateParams.dto';

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

  async updateComment(userId: number, updateParams: CommentUpdateParams) {
    if (!(await this.checkValidUser(updateParams.id, userId))) {
      throw new ForbiddenException(
        `User with id ${userId} can not modify comment with id ${updateParams.id}`,
      );
    } else {
      const comment = await this.prisma.comment.update({
        where: {
          id: updateParams.id,
        },
        data: {
          commentText: updateParams.commentText,
        },
      });
      return comment;
    }
  }

  async deleteComment(userId: number, id: number) {
    if (!(await this.checkValidUser(id, userId))) {
      throw new ForbiddenException(
        `User with id ${userId} can not modify comment with id ${id}`,
      );
    } else {
      await this.prisma.comment.delete({
        where: {
          id: id,
        },
      });
    }
  }

  async checkValidUser(commentId: number, userId: number) {
    const comments = await this.prisma.comment.findMany({
      where: {
        userId: userId,
        id: commentId,
      },
    });
    return comments.length > 0;
  }
}
