import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepo } from './user.repo';
import { User } from './domain/entity/user';

describe('UserService', () => {
  let userService: UserService;
  const mockUserRepo = {
    findByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: UserRepo, useValue: mockUserRepo }],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('findByUsername', () => {
    it('should return user when username is found', async () => {
      const username = 'user1';
      const user: User = {
        userId: '11111111-1111-1111-1111-111111111111',
        username: 'user1',
        password: 'password',
      };

      mockUserRepo.findByUsername.mockReturnValue(user);

      const result = await userService.findByUsername(username);
      expect(mockUserRepo.findByUsername).toHaveBeenCalledWith(username);
      expect(result).toEqual(user);
    });

    it('should handle the case when username is not found', async () => {
      const username = 'user1';

      mockUserRepo.findByUsername.mockReturnValue(null);

      const result = await userService.findByUsername(username);

      expect(mockUserRepo.findByUsername).toHaveBeenCalledWith(username);
      expect(result).toBeNull();
    });
  });
});
