// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { BlacklistedTokenService } from './blacklisted-token.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { User } from '../auth/entities/user.entity'
import { BlacklistedToken } from './entities/blacklist-token.entity';

@Module({
  imports: [
    ConfigModule, // for env config
    TypeOrmModule.forFeature([User,BlacklistedToken]), // ✅ for @InjectRepository(User)
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy,BlacklistedTokenService],
  controllers: [AuthController],
  exports: [AuthService,BlacklistedTokenService],
})
export class AuthModule {}
