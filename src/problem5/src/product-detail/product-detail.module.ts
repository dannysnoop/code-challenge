import { forwardRef, Module } from '@nestjs/common';
import { ProductDetailController } from './product-detail.controller';
import { ProductDetailService } from './product-detail.service';
import { ProductDetailRepository } from './product-detail.repository';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';
import { CategoryModule } from '../category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryTransactionEntity } from '../../entities/history-transaction.entity';

@Module({
  imports: [
    forwardRef(() => ProductModule),
    forwardRef(() => CategoryModule),
    TypeOrmModule.forFeature([HistoryTransactionEntity]),
  ],
  controllers: [ProductDetailController],
  providers: [
    ProductDetailService,
    ProductDetailRepository,
    { provide: 'IProductDetailService', useClass: ProductDetailService },
    { provide: 'IProductService', useClass: ProductService },
  ],
  exports: [ProductDetailService, ProductDetailRepository],
})
export class ProductDetailModule {}
