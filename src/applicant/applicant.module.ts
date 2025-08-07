// src/applicant/applicant.module.ts
import { Module } from '@nestjs/common';
import { ApplicantController } from './applicant.controller';
import { ApplicantService } from './applicant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant } from './entities/applicant.entity';
import { User } from 'src/auth/entities/user.entity';
import { BlacklistedToken } from 'src/auth/entities/blacklist-token.entity';
import { BlacklistedTokenService } from 'src/auth/blacklisted-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([Applicant,User,BlacklistedToken])],
  controllers: [ApplicantController],
  providers: [ApplicantService,BlacklistedTokenService],
})
export class ApplicantModule {}
