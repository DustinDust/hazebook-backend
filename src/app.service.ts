import { Injectable, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Injectable()
export class AppService {
  getHello(): string {
    return 'hello';
  }
}
