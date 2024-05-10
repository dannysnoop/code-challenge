import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ICategoryService } from './i.category.service';
import {
  CategoryResponse,
  CategoryDto,
  CategoryCreateRequest,
  CategoryUpdateRequest,
  CategoryQueryRequest,
} from './DTO/category.dto';
import { CategoryRepository } from './category.repository';
import { plainToInstance } from 'class-transformer';
import { CategoriesEntity } from '../../entities/categories.entity';
import { raw } from 'express';
import { COMMON_MESSAGE } from '../../helper/message';
import { ILike } from 'typeorm';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(private repository: CategoryRepository) {}

  searchProductThoughCategory(productName: string): Promise<CategoryDto[]> {
    return this.repository.find({
      where: { products: { title: ILike(`%${productName || ''}%`) } },
      relations: ['products', 'products.productDetails'],
      select: {
        title: true,
        order: true,
        id: true,
        icon: true,
        isShow: true,
        products: {
          id: true,
          title: true,
          price: true,
          description: true,
          subDescription: true,
          isShow: true,
          productDetails: { id: true, isSale: true },
        },
      },
    });
  }

  async getCategoryById(id: any): Promise<CategoryDto> {
    const data = await this.repository.findOne({
      where: { id, isShow: true, products: { isShow: true } },
      relations: ['products', 'products.productDetails'],
      select: {
        title: true,
        order: true,
        id: true,
        icon: true,
        isShow: true,
        products: {
          id: true,
          title: true,
          price: true,
          description: true,
          subDescription: true,
          isShow: true,
          productDetails: { id: true, isSale: true },
        },
      },
      order: { order: 'DESC' },
    });
    if (!data) {
      return await this.repository.findOneByOrFail({ id });
    }
    return data;
  }
  async getAllCategory(): Promise<CategoryResponse> {
    const [categories, total] = await this.repository.findAndCount();
    return new CategoryResponse(categories, 0, 1000, total);
  }

  async getAllCategoryForClient(): Promise<CategoryResponse> {
    const [categories, total] = await this.repository.findAndCount({
      where: { isShow: true },
      relations: ['products.productDetails'],
      select: {
        title: true,
        order: true,
        id: true,
        icon: true,
        products: {
          id: true,
          description: true,
          subDescription: true,
          isShow: true,
          title: true,
          price: true,
          productDetails: {
            id: true,
            isSale: true,
          },
        },
      },
      order: { order: 'DESC' },
    });
    return new CategoryResponse(categories, 0, 1000, total);
  }
  async createCategory(params: CategoryCreateRequest): Promise<CategoryDto> {
    const categoryEntity = plainToInstance(CategoriesEntity, params);
    return await this.repository.save(categoryEntity);
  }
  async updateCategory(
    id: number,
    params: CategoryUpdateRequest,
  ): Promise<CategoryDto> {
    const category = await this.repository.findOne({ where: { id: +id } });
    if (!category) {
      throw new HttpException(
        COMMON_MESSAGE.CATEGORY_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }

    const data = plainToInstance(CategoriesEntity, { ...category, ...params });
    this.repository.save(data);
    return data;
  }
}
