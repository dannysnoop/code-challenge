import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductEntity } from '../../entities/product.entity';
import { ProductEntityResponse } from './DTO/product.dto';

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
  constructor(private dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager());
  }

  async getProductById(id: number): Promise<ProductEntity> {
    return this.findOne({
      where: { id },
      relations: ['category', 'productDetails'],
      select: {
        category: { id: true, title: true },
      },
    });
  }

  async getAllProduct() {
    return this.findAndCount({
      relations: ['category', 'productDetails'],
      select: {
        category: { id: true, title: true },
        productDetails: { id: true, info: true , isSale: true , isShow: true},
      },
      order : {orderNumber: "ASC"}
    });
  }
}
