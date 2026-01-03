import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('res_snapshots')
@Index(['unitId', 'timestamp'])
@Index(['type', 'timestamp'])
@Index(['timestamp'])
export class RESSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, name: 'unit_id' })
  unitId: string;

  @Column({ type: 'timestamp with time zone' })
  timestamp: Date;

  @Column({ type: 'varchar', length: 10 })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  generation: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  capacity: number;

  @Column({ type: 'decimal', precision: 5, scale: 4, name: 'utilization_factor' })
  utilizationFactor: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  irradiance: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'wind_speed' })
  windSpeed: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  temperature: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
