import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { PlayersService } from '../services/player.service';
import { UploadPlayerDto } from '../dtos/upload-player.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { FastifyFileInterceptor } from '@/interceptors/fastify-file-interceptor';
import { editFileName } from '@/utils/file-upload-util';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FastifyFileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: editFileName,
      }),
    }),
  )
  async upload(
    @Body() uploadDto: UploadPlayerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const ranking = await this.playersService.uploadAndRank(
      uploadDto.name,
      uploadDto.classChar,
      uploadDto.type,
      file.filename,
    );
    return { message: 'Upload processado com sucesso', ranking };
  }
}
