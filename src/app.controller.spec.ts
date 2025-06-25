import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockAppService = {
    getHello: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const expectedResult = 'Hello World!';
      mockAppService.getHello.mockReturnValue(expectedResult);

      const result = appController.getHello();

      expect(result).toBe(expectedResult);
      expect(appService.getHello).toHaveBeenCalledTimes(1);
    });

    it('should call AppService.getHello method', () => {
      mockAppService.getHello.mockReturnValue('Test Message');

      appController.getHello();

      expect(appService.getHello).toHaveBeenCalled();
    });

    it('should return whatever AppService.getHello returns', () => {
      const customMessage = 'Custom Hello Message';
      mockAppService.getHello.mockReturnValue(customMessage);

      const result = appController.getHello();

      expect(result).toBe(customMessage);
    });
  });
});
