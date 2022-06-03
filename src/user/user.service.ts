import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateParams, UserFindParams } from './dto';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUser(findParams: UserFindParams) {
    const hasKeys = Object.keys(findParams).length > 0;
    const data = await this.prisma.user.findMany({
      where: {
        OR: hasKeys
          ? [
              { email: findParams.email },
              {
                name: {
                  contains: findParams.name,
                },
              },
              { id: findParams.id },
            ]
          : undefined,
      },
      select: {
        email: true,
        name: true,
        id: true,
        profilePicURL: true,
        friendRequestsReceived: {
          select: {
            sender: true,
          },
        },
        friending: true,
      },
    });
    return data;
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findOneById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createOne(userCP: UserCreateParams) {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...userCP,
        },
        select: {
          email: true,
          name: true,
          id: true,
        },
      });
      return user;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`Email ${userCP.email} is already used`);
      } else {
        throw new Error(e);
      }
    }
  }

  // update data only
  async updateUser(userData: User) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userData.id,
        },
        data: {
          email: userData.email,
          name: userData.name,
          hash: userData.hash,
        },
      });
      return updatedUser;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(e.message);
      } else {
        throw new Error(e);
      }
    }
  }

  /**
   * This function works with hashed refresh token
   * @param userId
   * @param hashRt
   */
  async updateUserRefreshHash(userId: number, hashRt: string) {
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          hashedRT: hashRt,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(e.message);
      } else {
        throw new Error(e);
      }
    }
  }

  /**
   * This function works with hashed refresh token
   * @param userId
   * @param hashRt
   */
  async removeRefreshHash(id: number) {
    try {
      await this.prisma.user.updateMany({
        where: {
          id: id,
          hashedRT: {
            not: null,
          },
        },
        data: {
          hashedRT: null,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(e.message);
      } else {
        throw new Error(e);
      }
    }
  }

  async deleteUser(id: number) {
    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
