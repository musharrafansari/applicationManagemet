import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  Matches,
  IsUrl,
} from 'class-validator';

export enum ApplicantStatus {
  APPLIED = 'applied',
  REVIEWED = 'reviewed',
  REJECTED = 'rejected',
  HIRED = 'hired',
}

export class CreateApplicantDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name with min 3 chars' })
  @IsString()
  @MinLength(3)
  fullName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Valid email address' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number (optional)',
    required: false,
  })
  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be valid E.164 format',
  })
  phone?: string;

  @ApiProperty({ example: 'Software Engineer', description: 'Position applied for' })
  @IsString()
  position: string;

  @ApiProperty({
    enum: ApplicantStatus,
    default: ApplicantStatus.APPLIED,
    description: 'Status of the applicant',
  })
  @IsEnum(ApplicantStatus)
  @IsOptional()
  status?: ApplicantStatus;

  @ApiProperty({ example: 'https://example.com/resume.pdf', description: 'URL to uploaded resume' })
  // @IsUrl()
  resumeUrl: string;
}
