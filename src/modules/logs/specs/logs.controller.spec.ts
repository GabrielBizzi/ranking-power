import { Test, TestingModule } from '@nestjs/testing';
import { LogsController } from './../controllers/logs.controller';
import { LogsService } from './../services/logs.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from '../entities/logs.entity';
import { Repository } from 'typeorm';

jest.setTimeout(20000);

describe('LogsController', () => {
  let controller: LogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsController],
      providers: [
        LogsService,
        {
          provide: getRepositoryToken(LogEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<LogsController>(LogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
