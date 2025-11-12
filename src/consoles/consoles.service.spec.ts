import { Test, TestingModule } from '@nestjs/testing';
import { ConsolesService } from './consoles.service';

describe('ConsolesService', () => {
  let service: ConsolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsolesService],
    }).compile();

    service = module.get<ConsolesService>(ConsolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
