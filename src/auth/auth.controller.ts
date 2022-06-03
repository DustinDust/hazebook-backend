import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ResponseType } from 'src/utils';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { JwtAccessAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwtRefresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() body: SignUpDTO): Promise<ResponseType> {
    try {
      const user = await this.authService.register(
        body.email,
        body.password,
        body.name,
      );
      if (user)
        return {
          success: true,
          message: 'Sign up success',
          data: user,
        };
    } catch (e) {
      throw e;
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Req() req): Promise<ResponseType> {
    const data = await this.authService.login(req.user);
    return {
      success: true,
      data: data,
      message: 'Sign-in success',
    };
  }

  @UseGuards(JwtAccessAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logOut(@Req() req): Promise<ResponseType> {
    const data = this.authService.logout(req.user.id);
    return {
      success: true,
      message: 'Logout success',
      data: data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Req() req): Promise<ResponseType> {
    console.log(req.user);
    const res = await this.authService.refreshTokens(
      req.user.userId,
      req.user.refresh_token,
    );
    return {
      success: true,
      message: 'Refresh success',
      data: res,
    };
  }
}
