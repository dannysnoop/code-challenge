import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from '../config/db-config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { ProductDetailModule } from './product-detail/product-detail.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';

import { ConfigWebModule } from './config-web/config-web.module';
import { LicenseController } from './license/license.controller';
import { LicenseService } from './license/license.service';
import { LicenseModule } from './license/license.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    UserModule,
    PostModule,
    OrderModule,
    CategoryModule,
    TransactionModule,
    ProductDetailModule,
    ProductModule,
    AuthModule,
    ConfigWebModule,
    LicenseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
