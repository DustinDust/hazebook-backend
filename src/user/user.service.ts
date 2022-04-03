import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return user;
    } else return null;
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (user) {
      return user;
    } else return null;
  }

  async createOne(email: string, hash: string, name: string) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: email,
          hash: hash,
          name: name,
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
        throw new ConflictException(`Email ${email} is already used`);
      } else {
        throw new Error(e);
      }
    }
  }

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
}
