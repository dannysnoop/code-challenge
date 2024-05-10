import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { DEPOSIT, ORDER_STATUS } from "../helper/constant";

@Entity('transactions')
export class TransactionsEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: string;

  @Column()
  amount: number;

  @Column({nullable : true})
  description: string;

  @Column({ unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: DEPOSIT,
    default: DEPOSIT.DEFAULT,
  })
  type: DEPOSIT;

  @Column({nullable : true})
  adminNameHandle: string;

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  user: UserEntity;

  @BeforeInsert()
  beforeInsert() {
    if(!this.code) {
      this.code = `${Math.floor(Math.random() * 1000000000) + 1}`;
    }
  }
}
