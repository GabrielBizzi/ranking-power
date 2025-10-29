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
    const s = {
      hp: stats.hp ?? 0,
      mp: stats.mp ?? 0,
      attack: stats.attack ?? 0,
      magicAttack: stats.magicAttack ?? 0,
      defense: stats.defense ?? 0,
      attackSpeed: stats.speedAttack ?? 0,
      crit: stats.critical ?? 0,
      critDamage: stats.criticalDamage ?? 0,
      critDefense: stats.criticalDefense ?? 0,
      pvpAttack: stats.pvpDamage ?? 0,
      pvpDefense: stats.pvpDefense ?? 0,
      penetration: stats.penetration ?? 0,
      absorption: stats.absorption ?? 0,
      precision: stats.precision ?? 0,
      evasion: stats.evasion ?? 0,
      manaEconomy: stats.manaEconomy ?? 0,
      movement: stats.movement ?? 0,
    };

    const DNweights: Record<string, Record<keyof typeof s, number>> = {
      Huntress: {
        hp: 0.05,
        mp: 0.05,
        attack: 0.25,
        defense: 0.1,
        magicAttack: 0,
        attackSpeed: 0.25,
        crit: 0.2,
        critDamage: 0.15,
        critDefense: 0.05,
        pvpAttack: 0.1,
        pvpDefense: 0.05,
        penetration: 0.05,
        absorption: 0.05,
        precision: 0.05,
        evasion: 0.1,
        manaEconomy: 0,
        movement: 0.05,
      },
      'Transknight Trans': {
        hp: 0.25,
        defense: 0.25,
        attack: 0.15,
        attackSpeed: 0.1,
        crit: 0.1,
        critDamage: 0.1,
        pvpAttack: 0.075,
        pvpDefense: 0.075,
        absorption: 0.1,
        penetration: 0.05,
        precision: 0.05,
        evasion: 0.05,
        manaEconomy: 0,
        movement: 0.05,
        mp: 0.05,
        magicAttack: 0,
        critDefense: 0.05,
      },
      'Transknight Confiança': {
        hp: 0.25,
        mp: 0.05,
        attack: 0.15,
        magicAttack: 0,
        defense: 0.25,
        attackSpeed: 0.1,
        crit: 0.1,
        critDamage: 0.1,
        critDefense: 0.05,
        pvpAttack: 0.075,
        pvpDefense: 0.075,
        penetration: 0.05,
        absorption: 0.1,
        precision: 0.05,
        evasion: 0.05,
        manaEconomy: 0,
        movement: 0.05,
      },
      'BeastMaster Elemental': {
        hp: 0.25,
        defense: 0.2,
        attack: 0.2,
        attackSpeed: 0.1,
        crit: 0.1,
        critDamage: 0.1,
        pvpAttack: 0.1,
        pvpDefense: 0.05,
        penetration: 0.05,
        absorption: 0.05,
        precision: 0.05,
        evasion: 0.05,
        manaEconomy: 0,
        movement: 0.05,
        mp: 0.05,
        magicAttack: 0,
        critDefense: 0.05,
      },
      'BeastMaster Evocação': {
        hp: 0.25,
        mp: 0.05,
        attack: 0.2,
        magicAttack: 0,
        defense: 0.2,
        attackSpeed: 0.1,
        crit: 0.1,
        critDamage: 0.1,
        critDefense: 0.05,
        pvpAttack: 0.1,
        pvpDefense: 0.05,
        penetration: 0.05,
        absorption: 0.05,
        precision: 0.05,
        evasion: 0.05,
        manaEconomy: 0,
        movement: 0.05,
      },
      'BeastMaster Natureza': {
        hp: 0.25,
        mp: 0.05,
        attack: 0.2,
        magicAttack: 0,
        defense: 0.2,
        attackSpeed: 0.1,
        crit: 0.1,
        critDamage: 0.1,
        critDefense: 0.05,
        pvpAttack: 0.1,
        pvpDefense: 0.05,
        penetration: 0.05,
        absorption: 0.05,
        precision: 0.05,
        evasion: 0.05,
        manaEconomy: 0,
        movement: 0.05,
      },
      'Foema Battle': {
        hp: 0.2,
        mp: 0.05,
        attack: 0.2,
        magicAttack: 0,
        defense: 0.2,
        attackSpeed: 0.1,
        crit: 0.1,
        critDamage: 0.1,
        critDefense: 0.05,
        pvpAttack: 0.1,
        pvpDefense: 0.1,
        penetration: 0.05,
        absorption: 0.05,
        precision: 0.05,
        evasion: 0.05,
        manaEconomy: 0,
        movement: 0.05,
      },
      'Foema White': {
        hp: 0.2,
        mp: 0.05,
        attack: 0.2,
        magicAttack: 0,
        defense: 0.2,
        attackSpeed: 0.1,
        crit: 0.1,
        critDamage: 0.1,
        critDefense: 0.05,
        pvpAttack: 0.1,
        pvpDefense: 0.1,
        penetration: 0.05,
        absorption: 0.05,
        precision: 0.05,
        evasion: 0.05,
        manaEconomy: 0,
        movement: 0.05,
      },
      'Foema Black': {
        hp: 0.2,
        mp: 0.05,
        attack: 0.2,
        magicAttack: 0,
        defense: 0.2,
        attackSpeed: 0.1,
        crit: 0.1,
        critDamage: 0.1,
        critDefense: 0.05,
        pvpAttack: 0.1,
        pvpDefense: 0.1,
        penetration: 0.05,
        absorption: 0.05,
        precision: 0.05,
        evasion: 0.05,
        manaEconomy: 0,
        movement: 0.05,
      },
    };
    const MGweights: Record<string, Record<keyof typeof s, number>> = {
      'Transknight MG': {
        hp: 0.15,
        mp: 0.15,
        attack: 0,
        magicAttack: 0.4,
        defense: 0.2,
        attackSpeed: 0.05,
        crit: 0.05,
        critDamage: 0.05,
        critDefense: 0.05,
        pvpAttack: 0.05,
        pvpDefense: 0.05,
        penetration: 0.05,
        absorption: 0.05,
        precision: 0.05,
        evasion: 0.05,
        manaEconomy: 0.05,
        movement: 0.05,
      },
      'BeastMaster Elemental': {
        hp: 0.15,
        mp: 0.15,
        attack: 0,
        magicAttack: 0.4,
        defense: 0.2,
        attackSpeed: 0.05,
        crit: 0.05,
        critDamage: 0.05,
        critDefense: 0.05,
        pvpAttack: 0.05,
        pvpDefense: 0.05,
        penetration: 0.05,
        absorption: 0.05,
        precision: 0.05,
        evasion: 0.05,
        manaEconomy: 0.05,
        movement: 0.05,
      },
      'BeastMaster Evocação': {
        hp: 0.15,
        mp: 0.15,
        attack: 0,
        magicAttack: 0.4,
        defense: 0.2,
        attackSpeed: 0.05,
        crit: 0.05,
        critDamage: 0.05,
        critDefense: 0.05,
        pvpAttack: 0.05,
        pvpDefense: 0.05,
        penetration: 0.05,
        absorption: 0.05,
        precision: 0.05,
        evasion: 0.05,
        manaEconomy: 0.05,
        movement: 0.05,
      },
      'BeastMaster Natureza': {
        hp: 0.15,
        mp: 0.15,
        attack: 0,
        magicAttack: 0.4,
        defense: 0.2,
        attackSpeed: 0.05,
        crit: 0.05,
        critDamage: 0.05,
        critDefense: 0.05,
        pvpAttack: 0.05,
        pvpDefense: 0.05,
        penetration: 0.05,
        absorption: 0.05,
        precision: 0.05,
        evasion: 0.05,
        manaEconomy: 0.05,
        movement: 0.05,
      },
      'Foema Battle': {
        hp: 0.15,
        mp: 0.15,
        attack: 0,
        magicAttack: 0.4,
        defense: 0.2,
        attackSpeed: 0.05,
        crit: 0.05,
        critDamage: 0.05,
        critDefense: 0.05,
        pvpAttack: 0.05,
        pvpDefense: 0.05,
        penetration: 0.05,
        absorption: 0.05,
        precision: 0.05,
        evasion: 0.05,
        manaEconomy: 0.05,
        movement: 0.05,
      },
      'Foema White': {
        hp: 0.15,
        mp: 0.15,
        attack: 0,
        magicAttack: 0.4,
        defense: 0.2,
        attackSpeed: 0.05,
        crit: 0.05,
        critDamage: 0.05,
        critDefense: 0.05,
        pvpAttack: 0.05,
        pvpDefense: 0.05,
        penetration: 0.05,
        absorption: 0.05,
        precision: 0.05,
        evasion: 0.05,
        manaEconomy: 0.05,
        movement: 0.05,
      },
      'Foema Black': {
        hp: 0.15,
        mp: 0.15,
        attack: 0,
        magicAttack: 0.4,
        defense: 0.1,
        attackSpeed: 0.05,
        crit: 0.05,
        critDamage: 0.05,
        critDefense: 0.05,
        pvpAttack: 0.05,
        pvpDefense: 0.05,
        penetration: 0.05,
        absorption: 0.05,
        precision: 0.05,
        evasion: 0.05,
        manaEconomy: 0.05,
        movement: 0.05,
      },
    };

    const weights =
      type === 'DN'
        ? (DNweights[classChar] ?? DNweights['Huntress'])
        : (MGweights[classChar] ?? MGweights['Foema Black']);

    let score = 0;
    for (const key in weights) {
      const statValue = s[key as keyof typeof s] ?? 0;
      const weight = weights[key as keyof typeof s] ?? 0;
      score += statValue * weight;
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

    // 🔍 tenta buscar o player existente
    let player = await this.playerRepo.findOne({ where: { name } });

    if (player) {
      // ✅ atualização explícita
      player.hp = stats.hp;
      player.mp = stats.mp;
      player.attack = stats.attack;
      player.magicAttack = stats.magicAttack;
      player.defense = stats.defense;
      player.speedAttack = stats.speedAttack;
      player.critical = stats.critical;
      player.criticalDamage = stats.criticalDamage;
      player.criticalDefense = stats.criticalDefense;
      player.pvpDamage = stats.pvpDamage;
      player.pvpDefense = stats.pvpDefense;
      player.penetration = stats.penetration;
      player.absorption = stats.absorption;
      player.precision = stats.precision;
      player.evasion = stats.evasion;
      player.manaEconomy = stats.manaEconomy;
      player.movement = stats.movement;
      player.score = score;
      player.classChar = classChar;
      player.type = type;

      await this.playerRepo.update(player.id, player); // 👈 garante update
    } else {
      // ✅ cria novo player
      player = this.playerRepo.create({
        name,
        ...stats,
        score,
        classChar,
        type,
      });
      await this.playerRepo.insert(player); // 👈 garante insert puro
    }

    // 🔄 força recarregar do banco
    const ranking = await this.playerRepo.find({
      order: { score: 'DESC' },
    });

    return ranking.map((p, i) => ({
      position: i + 1,
      score: p.score,
      name: p.name,
      classChar: p.classChar,
      type: p.type,
    }));
  }
}
