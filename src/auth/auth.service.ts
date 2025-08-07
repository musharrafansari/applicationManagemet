import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { BlacklistedTokenService } from './blacklisted-token.service';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private blacklistedTokenService: BlacklistedTokenService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { name, email, password,role} = createUserDto;
    const existing = await this.userRepository.findOne({ where: { email } });
    
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = this.userRepository.create({ name, email, password: hashedPassword,role });
    await this.userRepository.save(user);

    return { message: 'User registered successfully' };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    
    const payload = { sub: user.id, email: user.email, role: user.role};

    const token = this.jwtService.sign(payload);
    
    return { access_token: token };
  }

  async logout(token: string) {
  await this.blacklistedTokenService.blacklistToken(token);
}

findAll(query: any) {
    const { page = 1, limit = 10, name, status, position } = query;
    const where: any = {};
    if (name) where.name = ILike(`%${name}%`);
    if (status) where.status = status;
    if (position) where.position = position;

    return this.userRepository.find({
      where,
      skip: (page - 1) * limit,
      take: +limit,
    });
  }
}
