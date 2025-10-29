import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VersionService } from '../services/version.service';

@ApiTags('version')
@ApiBearerAuth()
@Controller({
  version: '1',
  path: '/version',
})
export class VersionController {
  constructor(private readonly appService: VersionService) {}

  @Get()
  getVersion(): string {
    return this.appService.getVersion();
  }
}
