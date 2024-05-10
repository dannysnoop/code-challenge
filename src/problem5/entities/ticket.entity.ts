import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { TICKER_PRIORITY, TICKER_STATUS } from '../helper/constant';
import { UserEntity } from './user.entity';

@Entity('tickets')
export class TicketEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({
    type: 'enum',
    enum: TICKER_PRIORITY,
    default: TICKER_PRIORITY.NORMAL,
  })
  priority: TICKER_PRIORITY;

  @Column({
    type: 'enum',
    enum: TICKER_STATUS,
    default: TICKER_STATUS.NEW,
  })
  status: TICKER_STATUS;

  @ManyToMany(() => UserEntity, (user) => user.tickets)
  @JoinTable()
  users: UserEntity[];
}
