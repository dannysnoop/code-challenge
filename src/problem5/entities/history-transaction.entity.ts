import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProductEntity } from './product.entity';

@Entity('history-transaction')
export class HistoryTransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => ProductEntity, (product) => product.historyTransactions)
  product: ProductEntity;
}
