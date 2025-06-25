import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user when username exists', async () => {
      const username = 'john';
      const expectedUser = {
        userId: 1,
        username: 'john',
        password: 'changeme',
      };

      const result = await service.findOne(username);

      expect(result).toEqual(expectedUser);
    });

    it('should return another user when username exists', async () => {
      const username = 'maria';
      const expectedUser = {
        userId: 2,
        username: 'maria',
        password: 'guess',
      };

      const result = await service.findOne(username);

      expect(result).toEqual(expectedUser);
    });

    it('should return undefined when username does not exist', async () => {
      const username = 'nonexistent';

      const result = await service.findOne(username);

      expect(result).toBeUndefined();
    });

    it('should return undefined when username is empty', async () => {
      const username = '';

      const result = await service.findOne(username);

      expect(result).toBeUndefined();
    });

    it('should return undefined when username is null', async () => {
      const username = null as any;

      const result = await service.findOne(username);

      expect(result).toBeUndefined();
    });

    it('should be case sensitive', async () => {
      const username = 'JOHN';

      const result = await service.findOne(username);

      expect(result).toBeUndefined();
    });

    it('should handle all available users', async () => {
      const users = ['john', 'maria'];
      const results = await Promise.all(
        users.map(username => service.findOne(username))
      );

      expect(results).toHaveLength(2);
      expect(results[0]?.username).toBe('john');
      expect(results[1]?.username).toBe('maria');
      expect(results.every(user => user !== undefined)).toBe(true);
    });
  });
});
