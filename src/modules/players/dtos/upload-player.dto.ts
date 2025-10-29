import { IsIn, IsString } from 'class-validator';

export class UploadPlayerDto {
  @IsString()
  name: string;

  @IsString()
  classChar: string;

  @IsIn(['DN', 'MG'])
  type: 'DN' | 'MG';
}
