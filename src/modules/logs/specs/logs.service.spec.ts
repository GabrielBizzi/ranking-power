import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from '../services/logs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity } from '../entities/logs.entity';

jest.setTimeout(20000);

describe('LogsService', () => {
  let service: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        {
          provide: getRepositoryToken(LogEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LogsService>(LogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
