import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { BlacklistedTokenService } from '../blacklisted-token.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt')  {
  constructor(
    private reflector: Reflector,
    private readonly blacklistedTokenService: BlacklistedTokenService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = (request.headers['authorization'] as string)?.split(' ')[1];

    if (token && await this.blacklistedTokenService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}