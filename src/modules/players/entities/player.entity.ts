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
  speedAttack: number;

  @Column('float', { default: 0 })
  critical: number;

  @Column('float', { default: 0 })
  criticalDamage: number;

  @Column('float', { default: 0 })
  pvpDamage: number;

  @Column('float', { default: 0 })
  pvpDefense: number;

  @Column('float', { default: 0 })
  precision: number;

  @Column('float', { default: 0 })
  evasion: number;

  @Column('float', { default: 0 })
  manaEconomy: number;

  @Column('float', { default: 0 })
  criticalDefense: number;

  @Column('float', { default: 0 })
  penetration: number;

  @Column('float', { default: 0 })
  absorption: number;

  @Column('float', { default: 0 })
  movement: number;

  @Column('varchar', { length: 100, nullable: true })
  classChar: string;

  @Column('varchar', { length: 2, nullable: true })
  type: 'DN' | 'MG';

  @Column('int', { default: 0 })
  score: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
