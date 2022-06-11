import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async getFriendList(userId: number) {
    const friendList = await this.prisma.user.findMany({
      where: {
        friendedBy: {
          some: {
            id: userId,
          },
        },
        friending: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        profilePicURL: true,
      },
    });
    return friendList;
  }

  async getFriendRecommendation(userId) {
    const recommendationList = await this.prisma.user.findMany({
      where: {
        friending: {
          some: {
            friending: {
              some: {
                id: userId,
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        profilePicURL: true,
      },
    });
    return recommendationList;
  }

  async unfriend(userId: number, friendId: number) {
    if (userId === friendId) throw new Error("Can't befriend youself.");
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        friending: {
          delete: {
            id: friendId,
          },
        },
        friendedBy: {
          delete: {
            id: friendId,
          },
        },
      },
    });
    await this.prisma.user.update({
      where: {
        id: friendId,
      },
      data: {
        friending: {
          delete: {
            id: userId,
          },
        },
        friendedBy: {
          delete: {
            id: userId,
          },
        },
      },
    });
  }

  async addFriend(userId: number, friendId: number) {
    if (userId === friendId) throw new Error("Can't befriend youself.");
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        friending: {
          connect: {
            id: friendId,
          },
        },
        friendedBy: {
          connect: {
            id: friendId,
          },
        },
      },
      select: {
        _count: {
          select: {
            friending: true,
          },
        },
        name: true,
        id: true,
        profilePicURL: true,
      },
    });
    return updatedUser;
  }

  async isFriend(senderId: number, receiverId: number) {
    return (
      (
        await this.prisma.user.findMany({
          where: {
            id: senderId,
            friendedBy: {
              some: {
                id: receiverId,
              },
            },
            friending: {
              some: {
                id: receiverId,
              },
            },
          },
        })
      ).length > 0
    );
  }
}
