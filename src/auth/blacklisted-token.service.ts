import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlacklistedToken } from '../auth/entities/blacklist-token.entity';

@Injectable()
export class BlacklistedTokenService {
  constructor(
    @InjectRepository(BlacklistedToken)
    private readonly blacklistedTokenRepo: Repository<BlacklistedToken>,
  ) {}

  async blacklistToken(token: string) {
    const entity = this.blacklistedTokenRepo.create({ token });
    return this.blacklistedTokenRepo.save(entity);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const exists = await this.blacklistedTokenRepo.findOne({ where: { token } });
    return !!exists;
  }
}
