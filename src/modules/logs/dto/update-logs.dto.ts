import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLogDto } from './create-logs.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLogDto extends PartialType(CreateLogDto) {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  log: string;
}
