import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: `${process.env.KEY_TABLE_NAME}_logs`.toUpperCase() })
export class LogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    type: 'text',
  })
  log: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @BeforeInsert()
  updateCreatedAt() {
    this.createdAt = new Date();

    this.createdAt.setHours(this.createdAt.getHours() - 3);
  }
}
