import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { INestApplication } from '@nestjs/common';

describe('UsersModule Integration', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UsersModule],
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

  it('should have users service', () => {
    const usersService = module.get('UsersService');
    expect(usersService).toBeDefined();
  });
});
