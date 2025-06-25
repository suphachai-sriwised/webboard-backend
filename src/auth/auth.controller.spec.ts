import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in a user and return access token', async () => {
      const signInDto = { username: 'john' };
      const expectedResult = {
        access_token: 'jwt.token.here',
      };

      mockAuthService.signIn.mockResolvedValue(expectedResult);

      const result = await controller.signIn(signInDto);

      expect(result).toEqual(expectedResult);
      expect(authService.signIn).toHaveBeenCalledWith(signInDto.username);
      expect(authService.signIn).toHaveBeenCalledTimes(1);
    });

    it('should handle sign in with invalid credentials', async () => {
      const signInDto = { username: 'invaliduser' };

      mockAuthService.signIn.mockRejectedValue(new UnauthorizedException());

      await expect(controller.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
      expect(authService.signIn).toHaveBeenCalledWith(signInDto.username);
      expect(authService.signIn).toHaveBeenCalledTimes(1);
    });

    it('should handle sign in with missing username', async () => {
      const signInDto = {};

      mockAuthService.signIn.mockResolvedValue(null);

      const result = await controller.signIn(signInDto);

      expect(result).toBeNull();
      expect(authService.signIn).toHaveBeenCalledWith(undefined);
      expect(authService.signIn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProfile', () => {
    it('should return user profile from request', async () => {
      const mockRequest = {
        user: {
          userId: 1,
          username: 'john',
        },
      };

      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual(mockRequest.user);
    });

    it('should return undefined when no user in request', async () => {
      const mockRequest = {};

      const result = await controller.getProfile(mockRequest);

      expect(result).toBeUndefined();
    });
  });
});
