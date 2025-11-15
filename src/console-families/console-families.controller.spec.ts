import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleFamiliesController } from './console-families.controller';

describe('ConsoleFamiliesController', () => {
  let controller: ConsoleFamiliesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsoleFamiliesController],
    }).compile();

    controller = module.get<ConsoleFamiliesController>(ConsoleFamiliesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
