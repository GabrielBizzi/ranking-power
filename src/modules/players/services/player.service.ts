import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerEntity } from '../entities/player.entity';
import { OcrService } from '@/modules/ocr/services/ocr.service';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(PlayerEntity)
    private readonly playerRepo: Repository<PlayerEntity>,
    private readonly ocrService: OcrService,
  ) {}

  calculateScore(stats: any, classChar: string, type: 'DN' | 'MG'): number {
    const base = {
      hp: 0,
      mp: 0,
      attack: 0,
      magicAttack: 0,
      defense: 0,
      attackSpeed: 0,
      crit: 0,
      critDamage: 0,
      pvpAttack: 0,
      pvpDefense: 0,
    };

    const DNweights: Record<string, Partial<typeof base>> = {
      Huntress: {
        attack: 0.25,
        attackSpeed: 0.25,
        crit: 0.2,
        critDamage: 0.15,
        pvpAttack: 0.1,
        pvpDefense: 0.05,
        hp: 0,
        defense: 0,
      },
      'Transknight Trans': {
        hp: 0.25,
        defense: 0.25,
        attack: 0.15,
        crit: 0.1,
        attackSpeed: 0.1,
        pvpAttack: 0.075,
        pvpDefense: 0.075,
      },
      'Transknight Confiança': {
        hp: 0.25,
        defense: 0.25,
        attack: 0.15,
        crit: 0.1,
        attackSpeed: 0.1,
        pvpAttack: 0.075,
        pvpDefense: 0.075,
      },
      'BeastMaster Elemental': {
        hp: 0.25,
        defense: 0.2,
        attack: 0.2,
        crit: 0.1,
        attackSpeed: 0.1,
        pvpAttack: 0.1,
        pvpDefense: 0.05,
      },
      'BeastMaster Evocação': {
        hp: 0.25,
        defense: 0.2,
        attack: 0.2,
        crit: 0.1,
        attackSpeed: 0.1,
        pvpAttack: 0.1,
        pvpDefense: 0.05,
      },
      'BeastMaster Natureza': {
        hp: 0.25,
        defense: 0.2,
        attack: 0.2,
        crit: 0.1,
        attackSpeed: 0.1,
        pvpAttack: 0.1,
        pvpDefense: 0.05,
      },
      'Foema Battle': {
        hp: 0.2,
        defense: 0.2,
        attack: 0.2,
        crit: 0.1,
        attackSpeed: 0.1,
        pvpAttack: 0.1,
        pvpDefense: 0.1,
      },
      'Foema White': {
        hp: 0.2,
        defense: 0.2,
        attack: 0.2,
        crit: 0.1,
        attackSpeed: 0.1,
        pvpAttack: 0.1,
        pvpDefense: 0.1,
      },
      'Foema Black': {
        hp: 0.2,
        defense: 0.2,
        attack: 0.2,
        crit: 0.1,
        attackSpeed: 0.1,
        pvpAttack: 0.1,
        pvpDefense: 0.1,
      },
    };

    const MGweights: Record<string, Partial<typeof base>> = {
      'Transknight MG': {
        magicAttack: 0.4,
        defense: 0.2,
        hp: 0.15,
        mp: 0.15,
        pvpAttack: 0.05,
        pvpDefense: 0.05,
      },
      'BeastMaster Elemental': {
        magicAttack: 0.4,
        defense: 0.2,
        hp: 0.15,
        mp: 0.15,
        pvpAttack: 0.05,
        pvpDefense: 0.05,
      },
      'BeastMaster Evocação': {
        magicAttack: 0.4,
        defense: 0.2,
        hp: 0.15,
        mp: 0.15,
        pvpAttack: 0.05,
        pvpDefense: 0.05,
      },
      'BeastMaster Natureza': {
        magicAttack: 0.4,
        defense: 0.2,
        hp: 0.15,
        mp: 0.15,
        pvpAttack: 0.05,
        pvpDefense: 0.05,
      },
      'Foema Battle': {
        magicAttack: 0.4,
        defense: 0.2,
        hp: 0.15,
        mp: 0.15,
        pvpAttack: 0.05,
        pvpDefense: 0.05,
      },
      'Foema White': {
        magicAttack: 0.4,
        defense: 0.2,
        hp: 0.15,
        mp: 0.15,
        pvpAttack: 0.05,
        pvpDefense: 0.05,
      },
      'Foema Black': {
        magicAttack: 0.4,
        defense: 0.2,
        hp: 0.15,
        mp: 0.15,
        pvpAttack: 0.05,
        pvpDefense: 0.05,
      },
    };

    const weights =
      type === 'DN'
        ? (DNweights[classChar] ?? base)
        : (MGweights[classChar] ?? base);

    let score = 0;
    for (const key in weights) {
      score += (stats[key] ?? 0) * weights[key];
    }

    return Math.round(score);
  }

  async uploadAndRank(
    name: string,
    classChar: string,
    type: 'DN' | 'MG',
    filePath: string,
  ) {
    const stats = await this.ocrService.extractStats(filePath);
    const score = this.calculateScore(stats, classChar, type);

    let player = await this.playerRepo.findOne({ where: { name } });
    if (player) {
      Object.assign(player, { ...stats, score, classChar, type });
      await this.playerRepo.save(player);
    } else {
      player = this.playerRepo.create({
        name,
        ...stats,
        score,
        classChar,
        type,
      });
      await this.playerRepo.save(player);
    }

    const ranking = await this.playerRepo.find({ order: { score: 'DESC' } });
    return ranking.map((p, i) => ({
      position: i + 1,
      score: p.score,
      name: p.name,
      classChar: p.classChar,
      type: p.type,
    }));
  }
}
