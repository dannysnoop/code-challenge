import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CategoriesEntity } from '../../entities/categories.entity';

@Injectable()
export class CategoryRepository extends Repository<CategoriesEntity> {
  constructor(private dataSource: DataSource) {
    super(CategoriesEntity, dataSource.createEntityManager());
  }
}
