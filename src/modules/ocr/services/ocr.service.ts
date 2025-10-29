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
    const magicAttack = parseInt(
      text.match(/Atq\s+M[aá]gico\s+(\d+)/)?.[1] ?? '0',
      10,
    );
    const speedAttack = parseFloat(
      text.match(/Vel(?:ocidade)?\s+Ataque\s+([\d\.]+)/)?.[1] ?? '0',
    );
    const critical = parseFloat(
      text.match(/Cr[ií]tico\s+([\d\.]+)/)?.[1] ?? '0',
    );
    const criticalDamage = parseFloat(
      text.match(/Dano\s+Cr[ií]tico\s+([\d\.]+)/)?.[1] ?? '0',
    );
    const criticalDefense = parseFloat(
      text.match(/Defesa\s+Cr[ií]tica\s+([\d\.]+)/)?.[1] ?? '0',
    );
    const pvpDamage = parseFloat(
      text.match(/Dano\s+PvP\s+([\d\.]+)/)?.[1] ?? '0',
    );
    const pvpDefense = parseFloat(
      text.match(/Defesa\s+PvP\s+([\d\.]+)/)?.[1] ?? '0',
    );
    const penetration = parseFloat(
      text.match(/Perfura[cç][aã]o\s+([\d\.]+)/)?.[1] ?? '0',
    );
    const absorption = parseFloat(
      text.match(/Absor[cç][aã]o\s+([\d\.]+)/)?.[1] ?? '0',
    );
    const precision = parseFloat(
      text.match(/Precis[aã]o\s+([\d\.]+)/)?.[1] ?? '0',
    );
    const evasion = parseFloat(text.match(/Evas[aã]o\s+([\d\.]+)/)?.[1] ?? '0');
    const manaEconomy = parseFloat(
      text.match(/Economia\s+de\s+Mana\s+([\d\.]+)/)?.[1] ?? '0',
    );
    const movement = parseFloat(
      text.match(/Movimento\s+([\d\.]+)/)?.[1] ?? '0',
    );

    await fs.unlink(normalizedPath);

    return {
      hp,
      mp,
      attack,
      defense,
      magicAttack,
      speedAttack,
      critical,
      criticalDamage,
      criticalDefense,
      pvpDamage,
      pvpDefense,
      penetration,
      absorption,
      precision,
      evasion,
      manaEconomy,
      movement,
    };
  }
}
