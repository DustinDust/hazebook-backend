import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async authenticateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      const isMatched = await this.passwordService.compare(password, user.hash);
      if (isMatched) {
        delete user.hash;
        delete user.hashedRT;
        return user;
      } else return null;
    }
  }

  async login(user: User) {
    const tokens = await this.generateTokens({ userId: user.id });
    await this.updateRefreshHash(user.id, tokens.refresh_token);
    return {
      ...tokens,
      user: user,
    };
  }

  async register(email: string, password: string, name: string) {
    const hash = await this.passwordService.hash(password);
    try {
      const user = await this.userService.createOne({ email, hash, name });
      if (user) {
        return user;
      }
    } catch (e) {
      if (e instanceof ConflictException) {
        throw e;
      } else throw new BadRequestException(e.message);
    }
  }

  async logout(userId: number) {
    try {
      await this.userService.removeRefreshHash(userId);
      return {
        success: true,
      };
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      } else {
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new ForbiddenException('Access denied');
    }
    const tokenMatched = await this.passwordService.compare(
      refreshToken,
      user.hashedRT,
    );
    if (!tokenMatched) {
      throw new ForbiddenException('Access denied');
    } else {
      const tokens = await this.generateTokens({ userId: userId });
      const hashedRT = await this.passwordService.hash(tokens.refresh_token);
      try {
        await this.userService.updateUserRefreshHash(userId, hashedRT);
      } catch (e) {
        if (e instanceof BadRequestException) {
          throw e;
        } else {
          throw new InternalServerErrorException(e.message);
        }
      }
      return tokens;
    }
  }

  async generateTokens(payload: { userId: number }) {
    const [access_token, refresh_token] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }

  async updateRefreshHash(userId: number, refreshToken: string) {
    const hash = await this.passwordService.hash(refreshToken);
    await this.userService.updateUserRefreshHash(userId, hash);
  }

  async generateRefreshToken(payload: { userId: number }) {
    const rt = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRESIN'),
    });
    return rt;
  }

  async generateAccessToken(payload: { userId: number }) {
    const at = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRESIN'),
    });
    return at;
  }
}
