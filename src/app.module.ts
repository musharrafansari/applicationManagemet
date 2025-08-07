import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApplicantModule } from './applicant/applicant.module';
import { Applicant } from './applicant/entities/applicant.entity';
import { User } from './auth/entities/user.entity';
import { BlacklistedToken } from './auth/entities/blacklist-token.entity';

@Module({
   imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT') || '5432'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Applicant,User,BlacklistedToken],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ApplicantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
