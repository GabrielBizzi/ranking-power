import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';
import * as fs from 'fs/promises';
import { join } from 'path';
import * as sharp from 'sharp';

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

    const processedPath = normalizedPath.replace(/(\.\w+)$/, '_clean$1');
    await (sharp as any)(normalizedPath)
      .grayscale()
      .normalize()
      .threshold(128)
      .toFile(processedPath);

    const { data } = await Tesseract.recognize(normalizedPath, 'por');

    const text = data.text.replace(/\s+/g, ' ');

    const getNum = (pattern: RegExp): number => {
      const match = text.match(pattern);
      if (!match) return 0;

      let raw = match[1].toString().trim();
      raw = raw.replace(',', '.');

      const found = raw.match(/(\d+(\.\d+)?)/);
      if (!found) return 0;

      const value = parseFloat(found[1]);
      return isNaN(value) ? 0 : value;
    };
    const hp = getNum(/H[EePp]\s*[:\-]?\s*(\d+)/i);
    const mp = getNum(/M[PpEeOo]\s*[:\-]?\s*(\d+)/i);
    const attack = getNum(/Ata[qukce]{1,3}\s*[:\-]?\s*(\d+)/i);
    const defense = getNum(/Def[e3]sa\s*[:\-]?\s*(\d+)/i);
    const magicAttack = getNum(/At[aá@]\s*M[aá]gic[o0]\s*(\d+)/i);
    const speedAttack = getNum(
      /Vel(?:ocidade)?\s*(?:At[aá@]q(?:ue)?|Ataque)\s*([\d.,]+)/i,
    );
    const critical = getNum(/Cr[ií1l]t[ií1l]c[o0]\s*([\d.,]+)/i);
    const criticalDamage = getNum(/Dano\s*Cr[ií1l]t[ií1l]c[o0]\s*([\d.,]+)/i);

    const pvpDamage = getNum(/Dano\s*P[vVuU][pP]\s*([\d.,]+)/i);
    const criticalDefense = getNum(
      /Def[e3]sa\s*(?:Cr[ií1l]t[ií1l]c[o0]|Crit|Cr[ií])\s*([\d.,]+)/i,
    );
    const pvpDefense = getNum(
      /Def[e3]sa\s*P[vVuU][pP]\s*(?:EXT|EX|E)?\s*([\d.,]+)/i,
    );
    const penetration = getNum(/Perfura[cç][aãa]o\s*([\d.,]+)/i);
    const absorption = getNum(/Absor[cç][aãa]o\s*([\d.,]+)/i);
    const precision = getNum(/Precis[aãa]o\s*([\d.,]+)/i);
    const evasion = getNum(/Evas[aãa]o\s*([\d.,]+)/i);
    const manaEconomy = getNum(/Economia\s*(?:de)?\s*Mana\s*([\d.,]+)/i);
    const movement = getNum(/Mov[ií1l]ment[o0]\s*([\d.,]+)/i);

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
