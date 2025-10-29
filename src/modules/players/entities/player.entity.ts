import { BaseEntity } from '@/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: `${process.env.KEY_TABLE_NAME}_players`.toUpperCase() })
export class PlayerEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column('int', { default: 0 })
  hp: number;

  @Column('int', { default: 0 })
  mp: number;

  @Column('int', { default: 0 })
  attack: number;

  @Column('int', { default: 0 })
  magicAttack: number;

  @Column('int', { default: 0 })
  defense: number;

  @Column('float', { default: 0 })
  attackSpeed: number;

  @Column('float', { default: 0 })
  crit: number;

  @Column('float', { default: 0 })
  critDamage: number;

  @Column('float', { default: 0 })
  pvpAttack: number;

  @Column('float', { default: 0 })
  pvpDefense: number;

  @Column('float', { default: 0 })
  precision: number;

  @Column('float', { default: 0 })
  evasion: number;

  @Column('float', { default: 0 })
  manaEfficiency: number;

  @Column('varchar', { length: 100, nullable: true })
  classChar: string;

  @Column('varchar', { length: 2, nullable: true })
  type: 'DN' | 'MG';

  @Column('int', { default: 0 })
  score: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
