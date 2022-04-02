import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(private configService: ConfigService) {}
  get bcryptSaltOrRounds(): string | number {
    const saltOrRounds = this.configService.get('BCRYPTSALTORROUND');
    return Number.isInteger(Number(saltOrRounds))
      ? Number(saltOrRounds)
      : saltOrRounds;
  }

  async hash(payload: string) {
    const hashed = await hash(payload, this.bcryptSaltOrRounds);
    return hashed;
  }

  async compare(payload: string, hashed: string) {
    const isMatch = await compare(payload, hashed);
    return isMatch;
  }
}
