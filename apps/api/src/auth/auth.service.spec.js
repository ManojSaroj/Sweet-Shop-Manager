import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('AuthService', () => {
  let service;
  let prismaService;
  let jwtService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    passwordHash: 'hashedpassword',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      jest.spyOn(service, 'generateTokens').mockResolvedValue(mockTokens);

      const result = await service.register(registerDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          passwordHash: expect.any(String),
          role: 'USER',
        },
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        },
        ...mockTokens,
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(service, 'verifyPassword').mockResolvedValue(true);
      jest.spyOn(service, 'generateTokens').mockResolvedValue(mockTokens);

      const result = await service.login(loginDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(service.verifyPassword).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.passwordHash,
      );
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        },
        ...mockTokens,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(service, 'verifyPassword').mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const payload = { sub: '1', email: 'test@example.com', role: 'USER' };
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      const result = await service.generateTokens('1', 'test@example.com', 'USER');

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        accessToken: 'token',
        refreshToken: 'token',
      });
    });
  });
});
