import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from '../enums/roles.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password (min 6 characters)' })
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: RolesEnum, example: RolesEnum.ADMIN, description: 'Role of the user' })
  @IsEnum(RolesEnum)
  role: RolesEnum;
}
