import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';
import * as fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class OcrService {
  async extractStats(filename: string) {
    const normalizedPath = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'upload',
      filename,
    );

    if (!normalizedPath) {
      throw new Error(`Arquivo não encontrado no caminho: ${normalizedPath}`);
    }

    const { data } = await Tesseract.recognize(normalizedPath, 'por');
    const text = data.text.replace(/\s+/g, ' ');
    const hp = parseInt(text.match(/HP\s+(\d+)/)?.[1] ?? '0', 10);
    const mp = parseInt(text.match(/MP\s+(\d+)/)?.[1] ?? '0', 10);
    const attack = parseInt(text.match(/Ataque\s+(\d+)/)?.[1] ?? '0', 10);
    const defense = parseInt(text.match(/Defesa\s+(\d+)/)?.[1] ?? '0', 10);
    const speedAttack = parseFloat(
      text.match(/Vel(?:ocidade)? Ataque\s+([\d\.]+)/)?.[1] ?? '0',
    );
    const critical = parseFloat(text.match(/Crí?tico\s+([\d\.]+)/)?.[1] ?? '0');
    const criticalDamage = parseFloat(
      text.match(/Dano Crí?tico\s+([\d\.]+)/)?.[1] ?? '0',
    );
    const pvpDamage = parseFloat(
      text.match(/Dano PvP\s+([\d\.]+)/)?.[1] ?? '0',
    );
    const pvpDefense = parseFloat(
      text.match(/Defesa PvP\s+([\d\.]+)/)?.[1] ?? '0',
    );
    const precision = parseFloat(
      text.match(/Precisão\s+([\d\.]+)/)?.[1] ?? '0',
    );
    const evasion = parseFloat(text.match(/Evasão\s+([\d\.]+)/)?.[1] ?? '0');

    await fs.unlink(normalizedPath);

    return {
      hp,
      mp,
      attack,
      defense,
      speedAttack,
      critical,
      criticalDamage,
      pvpDamage,
      pvpDefense,
      precision,
      evasion,
    };
  }
}
