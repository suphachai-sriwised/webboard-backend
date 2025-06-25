import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return access token for valid user', async () => {
      const username = 'john';
      const mockUser = {
        userId: 1,
        username: 'john',
        password: 'changeme',
      };
      const mockToken = 'jwt.token.here';

      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.signIn(username);

      expect(result).toEqual({
        access_token: mockToken,
      });
      expect(usersService.findOne).toHaveBeenCalledWith(username);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.userId,
        username: mockUser.username,
      });
    });

    it('should throw UnauthorizedException for invalid user', async () => {
      const username = 'invaliduser';

      mockUsersService.findOne.mockResolvedValue(null);

      await expect(service.signIn(username)).rejects.toThrow(UnauthorizedException);
      expect(usersService.findOne).toHaveBeenCalledWith(username);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when username does not match', async () => {
      const username = 'john';
      const mockUser = {
        userId: 1,
        username: 'differentuser',
        password: 'changeme',
      };

      mockUsersService.findOne.mockResolvedValue(mockUser);

      await expect(service.signIn(username)).rejects.toThrow(UnauthorizedException);
      expect(usersService.findOne).toHaveBeenCalledWith(username);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should exclude password from result payload', async () => {
      const username = 'john';
      const mockUser = {
        userId: 1,
        username: 'john',
        password: 'changeme',
      };
      const mockToken = 'jwt.token.here';

      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.signIn(username);

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.userId,
        username: mockUser.username,
      });
      expect(jwtService.signAsync).not.toHaveBeenCalledWith(
        expect.objectContaining({ password: expect.anything() })
      );
    });

    it('should handle JWT signing error', async () => {
      const username = 'john';
      const mockUser = {
        userId: 1,
        username: 'john',
        password: 'changeme',
      };

      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockRejectedValue(new Error('JWT signing failed'));

      await expect(service.signIn(username)).rejects.toThrow('JWT signing failed');
      expect(usersService.findOne).toHaveBeenCalledWith(username);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.userId,
        username: mockUser.username,
      });
    });
  });
});
