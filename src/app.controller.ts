import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAccessAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  @UseGuards(JwtAccessAuthGuard)
  @Get()
  getHello(@Req() req): string {
    return req.user;
  }
}
