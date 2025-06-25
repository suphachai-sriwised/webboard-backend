import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { jwtConstants } from './constants';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    const createMockExecutionContext = (authorizationHeader?: string): ExecutionContext => {
      return {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: authorizationHeader,
            },
          }),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as any;
    };

    it('should throw UnauthorizedException when no authorization header', async () => {
      const context = createMockExecutionContext();

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when authorization header does not start with Bearer', async () => {
      const context = createMockExecutionContext('Basic token123');

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when no token after Bearer', async () => {
      const context = createMockExecutionContext('Bearer ');

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when JWT verification fails', async () => {
      const context = createMockExecutionContext('Bearer invalid.jwt.token');
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('invalid.jwt.token', {
        secret: jwtConstants.secret,
      });
    });

    it('should return true and set user in request when valid JWT token', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid.jwt.token',
        },
      };
      const context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as any;

      const mockPayload = {
        sub: 1,
        username: 'john',
        iat: 1234567890,
        exp: 1234567890,
      };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockRequest['user']).toEqual(mockPayload);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid.jwt.token', {
        secret: jwtConstants.secret,
      });
    });

    it('should extract token correctly from Bearer header', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      const context = createMockExecutionContext(`Bearer ${token}`);
      const mockPayload = { sub: 1, username: 'john' };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

      await guard.canActivate(context);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: jwtConstants.secret,
      });
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid Bearer header', () => {
      const request = {
        headers: {
          authorization: 'Bearer token123',
        },
      };

      const token = (guard as any).extractTokenFromHeader(request);

      expect(token).toBe('token123');
    });

    it('should return undefined when no authorization header', () => {
      const request = {
        headers: {},
      };

      const token = (guard as any).extractTokenFromHeader(request);

      expect(token).toBeUndefined();
    });

    it('should return undefined when authorization header does not start with Bearer', () => {
      const request = {
        headers: {
          authorization: 'Basic token123',
        },
      };

      const token = (guard as any).extractTokenFromHeader(request);

      expect(token).toBeUndefined();
    });

    it('should return undefined when authorization header is just "Bearer"', () => {
      const request = {
        headers: {
          authorization: 'Bearer',
        },
      };

      const token = (guard as any).extractTokenFromHeader(request);

      expect(token).toBeUndefined();
    });
  });
});
