import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleFamiliesService } from './console-families.service';

describe('ConsoleFamiliesService', () => {
  let service: ConsoleFamiliesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsoleFamiliesService],
    }).compile();

    service = module.get<ConsoleFamiliesService>(ConsoleFamiliesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
