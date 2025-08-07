
import { Controller, Post, Body, UseGuards, Get, Request, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('createUser')
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and return JWT token' })
  @ApiResponse({ status: 200, description: 'JWT token returned' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('allUser')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users with optional filters' })
  @ApiResponse({ status: 200, description: 'List of users' })
    findAll(@Query() query: any) {
      return this.authService.findAll(query);
    }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: Request) {
  const token = (req.headers['authorization'] as string)?.split(' ')[1];
  await this.authService.logout(token);
  return { message: 'Logged out successfully' };
}

  @Get('loggedInUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged in user' })
  async getProfile(@Request() req) {
    return req.user;
  }
}
