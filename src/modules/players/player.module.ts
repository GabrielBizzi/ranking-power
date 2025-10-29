import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntity } from './entities/player.entity';
import { PlayersController } from './controllers/player.controller';
import { OcrService } from '../ocr/services/ocr.service';
import { PlayersService } from './services/player.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerEntity])],
  controllers: [PlayersController],
  providers: [PlayersService, OcrService],
})
export class PlayersModule {}
