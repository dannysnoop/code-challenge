import { forwardRef, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { CategoryModule } from '../category/category.module';
import { CategoryService } from '../category/category.service';
import { ProductDetailModule } from '../product-detail/product-detail.module';


@Module({
  imports: [
    forwardRef(() => CategoryModule),
    forwardRef(() => ProductDetailModule),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    { provide: 'IProductService', useClass: ProductService },
    { provide: 'ICategoryService', useClass: CategoryService },
  ],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
