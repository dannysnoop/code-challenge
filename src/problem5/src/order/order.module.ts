import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { ProductModule } from '../product/product.module';
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product/product.service';
import { CategoryModule } from '../category/category.module';
import { ProductDetailModule } from '../product-detail/product-detail.module';
import { ProductDetailService } from "../product-detail/product-detail.service";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { ConfigWebModule } from "../config-web/config-web.module";
import { ConfigWebService } from "../config-web/config-web.service";
import { CacheModule } from "@nestjs/cache-manager";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HistoryTransactionEntity } from "../../entities/history-transaction.entity";
import { LicenseEntity } from "../../entities/lisence.entity";

@Module({
  imports: [
    forwardRef(() => ProductModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => ProductDetailModule),
    forwardRef(() => UserModule),
    forwardRef(() => ConfigWebModule),
    TypeOrmModule.forFeature([HistoryTransactionEntity]),

  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    { provide: 'IOrderService', useClass: OrderService },
    { provide: 'IProductService', useClass: ProductService },
    { provide: 'IProductDetailService', useClass: ProductDetailService },
    { provide: 'IUserService', useClass: UserService },
    { provide: 'IConfigWebService', useClass: ConfigWebService },
  ],
})
export class OrderModule {}
