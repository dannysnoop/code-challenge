import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { UserEntity } from '../entities/user.entity';
import { TransactionsEntity } from '../entities/transactions.entity';
import { OrderEntity } from '../entities/order.entity';
import { ProductEntity } from '../entities/product.entity';
import { CategoriesEntity } from '../entities/categories.entity';
import { ProductDetailEntity } from '../entities/product-detail.entity';
import { TicketEntity } from '../entities/ticket.entity';
import { PostEntity } from '../entities/post.entity';
import { ConfigEntity } from "../entities/config.entity";
import { HistoryTransactionEntity } from "../entities/history-transaction.entity";
import { LicenseEntity } from "../entities/lisence.entity";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_URL,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [
    UserEntity,
    TransactionsEntity,
    OrderEntity,
    ProductEntity,
    CategoriesEntity,
    ProductDetailEntity,
    TicketEntity,
    PostEntity,
    ConfigEntity,
    HistoryTransactionEntity,
    LicenseEntity
  ],
  synchronize: !!+process.env.DB_SYNC,
};
