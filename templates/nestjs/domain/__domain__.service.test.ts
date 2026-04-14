import { Test, TestingModule } from '@nestjs/testing';
import { __Domain__Service } from '../services/__domain__.service';

describe('__Domain__Service', () => {
  let service: __Domain__Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [__Domain__Service],
    }).compile();

    service = module.get<__Domain__Service>(__Domain__Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
