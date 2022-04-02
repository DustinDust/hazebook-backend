import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
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
  ) {}

  async authenticateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      const isMatched = await this.passwordService.compare(password, user.hash);
      if (isMatched) {
        delete user.hash;
        return user;
      } else return null;
    }
  }

  async login(user: User) {
    return {
      access_token: this.generateAccessToken({ userId: user.id }),
      user: user,
    };
  }

  async register(email: string, password: string, name: string) {
    const hash = await this.passwordService.hash(password);
    try {
      const user = await this.userService.createOne(email, hash, name);
      if (user) {
        return user;
      }
    } catch (e) {
      if (e instanceof ConflictException) {
        throw e;
      } else throw new BadRequestException(e.message);
    }
  }

  generateToken(payload: { userId: number }) {
    return {
      access_token: this.generateAccessToken(payload),
    };
  }

  generateRefreshToken(payload: { userId: number }) {
    return this.jwtService.sign(payload);
  }

  generateAccessToken(payload: { userId: number }) {
    return this.jwtService.sign(payload);
  }
}
