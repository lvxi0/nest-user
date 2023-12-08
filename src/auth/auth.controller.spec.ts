/*
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { HttpException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from "../user/domain/entity/user"; // Assuming this import is needed

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('signIn', () => {
    it('should return the result of authService.signIn', async () => {
      const signInDto: SignInDto = {
        username: 'ValidUsername',
        password: 'ValidPassword_123',
      };

      mockAuthService.signIn.mockReturnValue('access_token');

      const result = await authController.signIn(signInDto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(signInDto);
      expect(result).toBe('access_token');
    });

    it('should handle validation error from authService.signIn and return custom error message', async () => {
      const signInDto: SignInDto = {
        // Invalid username and password intentionally to trigger validation error
        username: '',
        password: '',
      };

      // Mocking authService.signIn to throw an exception with custom error message
      mockAuthService.signIn.mockImplementation(() => {
        const validationError = new Error('Validation failed');
        validationError['response'] = {
          message:
            'Must contain at least one uppercase letter, one lowercase letter, ' +
            'and only use letters and numbers. Length must be between 5 and 32 characters.',
        };
        throw validationError;
      });

      await expect(authController.signIn(signInDto)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
*/

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('signIn', () => {
    it('should return the result of authService.signIn', async () => {
      const signInDto: SignInDto = {
        username: 'ValidUsername',
        password: 'ValidPassword_123',
      };

      mockAuthService.signIn.mockReturnValue('access_token');

      const result = await authController.signIn(signInDto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(signInDto);
      expect(result).toBe('access_token');
    });

    it('should handle validation error from authService.signIn and return custom error message', async () => {
      const signInDto: SignInDto = {
        // Invalid username and password intentionally to trigger validation error
        username: '',
        password: '',
      };

      // Mocking authService.signIn to throw a validation error
      mockAuthService.signIn.mockRejectedValue([
        {
          constraints: {
            matches:
              'Must contain at least one uppercase letter, one lowercase letter, ' +
              'and only use letters and numbers. Length must be between 5 and 32 characters.',
          },
        },
      ]);

      await expect(authController.signIn(signInDto)).rejects.toEqual([
        {
          constraints: {
            matches:
              'Must contain at least one uppercase letter, one lowercase letter, ' +
              'and only use letters and numbers. Length must be between 5 and 32 characters.',
          },
        },
      ]);
    });
  });
});
