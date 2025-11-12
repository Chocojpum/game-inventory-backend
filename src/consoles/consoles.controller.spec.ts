import { Test, TestingModule } from '@nestjs/testing';
import { ConsolesController } from './consoles.controller';

describe('ConsolesController', () => {
  let controller: ConsolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsolesController],
    }).compile();

    controller = module.get<ConsolesController>(ConsolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
