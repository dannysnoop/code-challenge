import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { UserService } from '../user/user.service';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
    { provide: 'ICategoryService', useClass: CategoryService },
  ],
  exports: [CategoryRepository, CategoryService],
})
export class CategoryModule {}
