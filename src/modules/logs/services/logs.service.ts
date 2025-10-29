import { Injectable } from '@nestjs/common';
import { CreateLogDto } from '../dto/create-logs.dto';
import { LogEntity } from '../entities/logs.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
  ) {}

  async create(data: CreateLogDto) {
    const log = this.logRepository.create(data);
    return await this.logRepository.save(log);
  }

  async findAll() {
    return await this.logRepository.find();
  }
}
