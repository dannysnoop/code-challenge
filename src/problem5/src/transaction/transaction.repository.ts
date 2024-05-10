import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CategoriesEntity } from '../../entities/categories.entity';
import { TransactionsEntity } from '../../entities/transactions.entity';

@Injectable()
export class TransactionRepository extends Repository<TransactionsEntity> {
  constructor(private dataSource: DataSource) {
    super(TransactionsEntity, dataSource.createEntityManager());
  }
}
