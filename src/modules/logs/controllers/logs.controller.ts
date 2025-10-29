import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LogsService } from '../services/logs.service';

@ApiTags('logs')
@Controller({
  version: '1',
  path: '/logs',
})
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  @ApiBearerAuth()
  findAll() {
    return this.logsService.findAll();
  }
}
