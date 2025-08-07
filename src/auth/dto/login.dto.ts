import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({example: 'musharraf@gmail.com', description: 'email of the user'})
  @IsEmail()
  email: string;

  @ApiProperty({example: 'dummy', description: 'Password of the user'})
  @IsNotEmpty()
  password: string;
}
