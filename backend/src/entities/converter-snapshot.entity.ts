import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('converter_snapshots')
@Index(['converterId', 'timestamp'])
@Index(['timestamp'])
export class ConverterSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, name: 'converter_id' })
  converterId: string;

  @Column({ type: 'timestamp with time zone' })
  timestamp: Date;

  @Column({ type: 'varchar', length: 20 })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  voltage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'current_d' })
  currentD: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'current_q' })
  currentQ: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'active_power' })
  activePower: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'reactive_power' })
  reactivePower: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  frequency: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  thd: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  temperature: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
