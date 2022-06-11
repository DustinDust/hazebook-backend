import { BadRequestException, Injectable } from '@nestjs/common';
import { RequestState } from '@prisma/client';
import { FriendService } from 'src/friend/Friend.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendRequestService {
  constructor(
    private prisma: PrismaService,
    private readonly friendService: FriendService,
  ) {}

  async sendFriendRequest(senderId: number, receiverId: number) {
    if (senderId === receiverId)
      throw new BadRequestException('Invalid request');
    if (this.friendService.isFriend(senderId, receiverId)) {
      throw new BadRequestException('Meaningless');
    }
    const data = await this.prisma.friendRequest.create({
      data: {
        requestState: RequestState.PENDING,
        receiverId: receiverId,
        senderId: senderId,
      },
    });
    return data;
  }

  async acceptFriendRequest(senderId: number, receiverId: number) {
    if (senderId === receiverId)
      throw new BadRequestException('Invalid request');
    const updatedRequest = await this.prisma.friendRequest.update({
      where: {
        senderId_receiverId: {
          senderId: senderId,
          receiverId: receiverId,
        },
      },
      data: {
        requestState: RequestState.ACCEPTED,
      },
    });
    const user = await this.friendService.addFriend(senderId, receiverId);
    return { updatedRequest, user };
  }

  async rejectFriendRequest(senderId: number, receiverId: number) {
    if (senderId === receiverId)
      throw new BadRequestException('Invalid request');
    const rejection = await this.prisma.friendRequest.update({
      where: {
        senderId_receiverId: {
          senderId: senderId,
          receiverId: receiverId,
        },
      },
      data: {
        requestState: RequestState.REJECTED,
      },
    });
    return rejection;
  }

  async getRequestList(userId: number) {
    return await this.prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        requestState: {
          notIn: [RequestState.ACCEPTED, RequestState.REJECTED],
        },
      },
    });
  }

  async getRequestSent(userId: number) {
    return await this.prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        requestState: {
          notIn: [RequestState.ACCEPTED, RequestState.REJECTED],
        },
      },
    });
  }
}
