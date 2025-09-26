import { Injectable, ConflictException, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { createHash, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(@Inject(PrismaService) prisma, @Inject(JwtService) jwtService) {
    this.prisma = prisma;
    this.jwtService = jwtService;
  }

  async register(registerDto) {
    const { email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'USER',
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
  }

  async login(loginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
  }

  async generateTokens(userId, email, role) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const hash = await scryptAsync(password, salt, 64);
    return salt + ':' + hash.toString('hex');
  }

  async verifyPassword(password, hashedPassword) {
    const [salt, hash] = hashedPassword.split(':');
    const hashBuffer = await scryptAsync(password, salt, 64);
    return hashBuffer.toString('hex') === hash;
  }
}
