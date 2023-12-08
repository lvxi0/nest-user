import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthRepo } from './auth.repo';
import { getModelToken } from '@nestjs/mongoose';
import { Login } from './domain/entity/login';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../user/domain/entity/user';

describe('AuthService', () => {
  let service: AuthService;
  const mockAutoRepo = {
    findByUserId: jest.fn(),
    updateByUserId: jest.fn(),
  };

  const mockUserService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepo, useValue: mockAutoRepo },
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: getModelToken(Login.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should throw not found exception if username not exist', async () => {
    mockUserService.findByUsername.mockReturnValue(null);

    const signInDto = { username: 'username1', password: 'password1' };
    await expect(service.signIn(signInDto)).rejects.toThrow(NotFoundException);
  });

  it('should throw not found exception if user login info not exist', async () => {
    const user: User = {
      userId: '11111111-1111-1111-1111-111111111111',
      username: 'user1',
      password: '$2b$10$bFMheEZ74ZMriGmsy1aON.RN5ta8F.L5wHZ66eatQsLaojJIyAGDe',
    };
    mockUserService.findByUsername.mockReturnValue(user);

    mockAutoRepo.findByUserId.mockReturnValue(null);

    const signInDto = { username: 'username1', password: 'password1' };
    await expect(service.signIn(signInDto)).rejects.toThrow(NotFoundException);
  });

  it('should throw forbidden exception if user is locked', async () => {
    const user: User = {
      userId: '11111111-1111-1111-1111-111111111111',
      username: 'user1',
      password: '$2b$10$bFMheEZ74ZMriGmsy1aON.RN5ta8F.L5wHZ66eatQsLaojJIyAGDe',
    };
    mockUserService.findByUsername.mockReturnValue(user);

    const login: Login = {
      userId: '11111111-1111-1111-1111-111111111111',
      isLocked: true,
      lockedAt: null,
      invalidLoginTimestamps: [],
    };
    mockAutoRepo.findByUserId.mockReturnValue(login);

    const signInDto = { username: 'user1', password: 'password1' };
    await expect(service.signIn(signInDto)).rejects.toThrow(ForbiddenException);
  });

  it('should throw unauthorized exception if password not correct', async () => {
    const user: User = {
      userId: '11111111-1111-1111-1111-111111111111',
      username: 'user1',
      password: '$2b$10$bFMheEZ74ZMriGmsy1aON.RN5ta8F.L5wHZ66eatQsLaojJIyAGDe',
    };
    mockUserService.findByUsername.mockReturnValue(user);

    const login: Login = {
      userId: '11111111-1111-1111-1111-111111111111',
      isLocked: false,
      lockedAt: null,
      invalidLoginTimestamps: [],
    };
    mockAutoRepo.findByUserId.mockReturnValue(login);

    const signInDto = { username: 'user1', password: 'password1' };
    await expect(service.signIn(signInDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return token if credentials are correct', async () => {
    const user: User = {
      userId: '11111111-1111-1111-1111-111111111111',
      username: 'user1',
      password: '$2b$10$bFMheEZ74ZMriGmsy1aON.RN5ta8F.L5wHZ66eatQsLaojJIyAGDe',
    };
    mockUserService.findByUsername.mockReturnValue(user);

    const login: Login = {
      userId: '11111111-1111-1111-1111-111111111111',
      isLocked: false,
      lockedAt: null,
      invalidLoginTimestamps: [],
    };
    mockAutoRepo.findByUserId.mockReturnValue(login);

    mockJwtService.sign.mockReturnValue('access_token');

    const signInDto = { username: 'user1', password: 'password-1' };
    const result = await service.signIn(signInDto);

    expect(result).toEqual({ assessToken: 'access_token' });
  });

  it('should return true if password correct', async () => {
    const pass = 'password-1';
    const hPass =
      '$2b$10$bFMheEZ74ZMriGmsy1aON.RN5ta8F.L5wHZ66eatQsLaojJIyAGDe';
    const result = await service.comparePasswords(pass, hPass);
    expect(result).toEqual(true);
  });

  it('should return false if password not correct', async () => {
    const pass = 'password1';
    const hPass =
      '$2b$10$bFMheEZ74ZMriGmsy1aON.RN5ta8F.L5wHZ66eatQsLaojJIyAGDe';
    const result = await service.comparePasswords(pass, hPass);
    expect(result).toEqual(false);
  });

  it('should add failed login', async () => {
    const login: Login = {
      userId: '11111111-1111-1111-1111-111111111111',
      isLocked: false,
      lockedAt: null,
      invalidLoginTimestamps: [],
    };

    mockAutoRepo.findByUserId.mockReturnValue(login);

    await service.addFailedLogin(login);
    expect(mockAutoRepo.updateByUserId).toHaveBeenCalledWith(
      login.userId,
      expect.anything(),
    );
  });

  it('should not lock user after 3 failed logins if not within 5 mins', async () => {
    // Use current time and subtract 6 and 4 minutes for the timestamps
    const currentTime = new Date();
    const sixMinutesAgo = new Date(currentTime.getTime() - 6 * 60000);
    const fourMinutesAgo = new Date(currentTime.getTime() - 4 * 60000);

    const login: Login = {
      userId: '11111111-1111-1111-1111-111111111111',
      invalidLoginTimestamps: [
        sixMinutesAgo.toISOString(), // 6 minutes ago
        fourMinutesAgo.toISOString(), // 4 minutes ago
      ],
      isLocked: false,
      lockedAt: null,
    };

    await service.addFailedLogin(login);

    expect(login.isLocked).toBe(false); // User should not be locked
    expect(login.lockedAt).toBeNull(); // LockedAt should still be null
    expect(mockAutoRepo.updateByUserId).toHaveBeenCalledWith(
      login.userId,
      expect.anything(),
    );
  });

  it('should lock user after 3 failed logins', async () => {
    // Use current time and subtract 1 minute for the first timestamp
    const currentTime = new Date();
    const oneMinuteAgo = new Date(currentTime.getTime() - 60000);
    const twoMinutesAgo = new Date(currentTime.getTime() - 120000);

    const login: Login = {
      userId: 'testUserId',
      invalidLoginTimestamps: [
        twoMinutesAgo.toISOString(), // 2 minutes ago
        oneMinuteAgo.toISOString(), // 1 minute ago
      ],
      isLocked: false,
      lockedAt: null,
    };

    await expect(service.addFailedLogin(login)).rejects.toThrow(
      ForbiddenException,
    );
    expect(login.isLocked).toBe(true);
    expect(login.lockedAt).not.toBeNull();
    expect(mockAutoRepo.updateByUserId).toHaveBeenCalledWith(
      login.userId,
      expect.anything(),
    );
  });
});
