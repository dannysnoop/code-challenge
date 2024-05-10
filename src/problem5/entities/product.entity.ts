import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { CategoriesEntity } from './categories.entity';
import { OrderEntity } from './order.entity';
import { ProductDetailEntity } from './product-detail.entity';
import { HistoryTransactionEntity } from "./history-transaction.entity";

@Entity('products')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ default: 0 })
  price: number;
  @Column({ default: 0, nullable: true })
  holdSale: number;

  @Column({ default: 0, nullable: true })
  quantityLimit: number;
  @Column()
  title: string;

  @Column()
  description: string;
  @Column()
  subDescription: string;
  @Column()
  orderNumber: number;
  @Column({ default: true })
  isShow: boolean;

  @ManyToOne(() => CategoriesEntity, (category) => category.products)
  category: CategoriesEntity;

  @OneToMany(() => OrderEntity, (order) => order.product)
  orders: OrderEntity[];
  @OneToMany(() => HistoryTransactionEntity, (history) => history.product)
  historyTransactions: HistoryTransactionEntity[];

  @OneToMany(
    () => ProductDetailEntity,
    (productDetail) => productDetail.product,
  )
  productDetails: ProductDetailEntity[];
}
