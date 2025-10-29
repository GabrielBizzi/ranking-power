import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateLogSchema = z.object({
  log: z.string(),
});

export class CreateLogDto extends createZodDto(CreateLogSchema) {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  log: string;
}
