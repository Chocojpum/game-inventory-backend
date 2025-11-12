import { Test, TestingModule } from '@nestjs/testing';
import { CompletionTypesController } from './completion-types.controller';

describe('CompletionTypesController', () => {
  let controller: CompletionTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompletionTypesController],
    }).compile();

    controller = module.get<CompletionTypesController>(CompletionTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
