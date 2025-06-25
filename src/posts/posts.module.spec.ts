import { Test, TestingModule } from '@nestjs/testing';
import { PostsModule } from './posts.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';

describe('PostsModule Integration', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PostsModule],
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

  it('should have posts controller', () => {
    const postsController = module.get('PostsController');
    expect(postsController).toBeDefined();
  });

  it('should have posts service', () => {
    const postsService = module.get('PostsService');
    expect(postsService).toBeDefined();
  });
});
