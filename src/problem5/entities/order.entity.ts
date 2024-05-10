import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { ORDER_STATUS } from '../helper/constant';
import { ProductEntity } from './product.entity';
import { ProductDetailEntity } from "./product-detail.entity";
import { TransactionsEntity } from "./transactions.entity";

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  quantity: number;

  @Column({ default: 0 })
  totalPrice: number;

  @ManyToOne(() => ProductEntity, (product) => product.orders)
  product: ProductEntity;

  @OneToMany(() => ProductDetailEntity, (productDetail) => productDetail.order)
  productDetails: ProductDetailEntity[];
  @Column({
    type: 'enum',
    enum: ORDER_STATUS,
    default: ORDER_STATUS.SUCCESS,
  })
  status: ORDER_STATUS;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

}
