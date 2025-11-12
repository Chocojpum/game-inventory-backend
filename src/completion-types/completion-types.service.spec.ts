import { Test, TestingModule } from '@nestjs/testing';
import { CompletionTypesService } from './completion-types.service';

describe('CompletionTypesService', () => {
  let service: CompletionTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompletionTypesService],
    }).compile();

    service = module.get<CompletionTypesService>(CompletionTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
