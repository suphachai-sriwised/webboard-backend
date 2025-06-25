import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { INestApplication } from '@nestjs/common';

describe('AuthModule Integration', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should compile without errors', () => {
    expect(app).toBeDefined();
  });

  it('should have auth controller', () => {
    const authController = module.get('AuthController');
    expect(authController).toBeDefined();
  });

  it('should have auth service', () => {
    const authService = module.get('AuthService');
    expect(authService).toBeDefined();
  });

  it('should have auth guard', () => {
    const authGuard = module.get('AuthGuard');
    expect(authGuard).toBeDefined();
  });
});
