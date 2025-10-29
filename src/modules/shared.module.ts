import { Module } from '@nestjs/common';
import { LogsModule } from './logs/logs.module';
import { VersionModule } from './version/version.module';
import { PlayersModule } from './players/player.module';

@Module({
  imports: [VersionModule, LogsModule, PlayersModule],
  controllers: [],
  providers: [],
})
export class SharedModule {}
