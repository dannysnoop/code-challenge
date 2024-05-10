import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from './product.entity';
import { BaseEntity } from './base.entity';

@Entity('categories')
export class CategoriesEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({nullable: true})
  title: string;

  @Column({ default : 0})
  order: number;

  @Column({ default: true })
  isShow: boolean;

  @Column({ type: 'varchar', length: 50 , nullable: true })
  icon: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
