import { Injectable } from '@nestjs/common';
import { version } from '../../../../package.json';
@Injectable()
export class VersionService {
  getVersion(): string {
    return `v${version}-${process.env.NODE_ENV}`;
  }
}
