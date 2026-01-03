import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('bus_snapshots')
@Index(['busId', 'timestamp'])
@Index(['timestamp'])
export class BusSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, name: 'bus_id' })
  busId: string;

  @Column({ type: 'timestamp with time zone' })
  timestamp: Date;

  @Column({ type: 'decimal', precision: 10, scale: 4, name: 'voltage_magnitude' })
  voltageMagnitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'voltage_angle' })
  voltageAngle: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  frequency: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'active_power' })
  activePower: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'reactive_power' })
  reactivePower: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
