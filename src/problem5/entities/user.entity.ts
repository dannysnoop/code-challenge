import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ROLE } from '../helper/constant';
import { TransactionsEntity } from './transactions.entity';
import { OrderEntity } from './order.entity';
import { TicketEntity } from './ticket.entity';
import { LicenseEntity } from './lisence.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 50, name: 'email', unique: true })
  email: string;
  @Column()
  username: string;
  @Column({ nullable: true })
  phone: string;
  @Column()
  password: string;

  @Column({ default: 0 })
  balance: number;

  @Column({ default: false })
  is2FA: boolean;

  @Column({ length: 6, nullable: true })
  OTP: string;

  @Column({
    type: 'enum',
    enum: ROLE,
    default: ROLE.MEMBER,
  })
  role: ROLE;

  @Column({ nullable: true })
  device: string;

  @Column({ nullable: true })
  lastLogin: Date;
  @Column({ nullable: true })
  ip: string;

  @Column({ default: 0 })
  totalBalance: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  discount: number;
  @Column({ default: null })
  secretCodeTransfer: string;

  @OneToMany(() => TransactionsEntity, (transaction) => transaction.user)
  transactions: TransactionsEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @ManyToMany(() => TicketEntity, (ticket) => ticket.users)
  tickets: TicketEntity[];

  @OneToMany(() => LicenseEntity, (license) => license.user)
  licenses: LicenseEntity[];
}
