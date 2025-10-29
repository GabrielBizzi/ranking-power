import { Module } from '@nestjs/common';
import { LogsService } from './services/logs.service';
import { LogsController } from './controllers/logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './entities/logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
