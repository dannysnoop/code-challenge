import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProductEntity } from './product.entity';
import { OrderEntity } from './order.entity';

@Entity('product_details')
export class ProductDetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => ProductEntity, (product) => product.productDetails)
  product: ProductEntity;

  @ManyToOne(() => OrderEntity, (order) => order.productDetails)
  order: OrderEntity;
  @Column()
  info: string;

  @Column({ default: true })
  isShow: boolean;

  @Column({ nullable: true })
  uid: string;

  @Column({ default: false })
  isSale: boolean;

  @BeforeInsert()
  async beforeUpdate() {
    this.uid = this.info.split('|')[0];
  }
}
