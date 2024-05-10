import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { IProductService } from './i.product.service';
import {
  ProductResponse,
  ProductDto,
  ProductQueryRequest,
  ProductCreateRequest,
  ProductEntityResponse,
} from './DTO/product.dto';
import { ILike } from 'typeorm';
import { COMMON_MESSAGE } from '../../helper/message';
import { ProductEntity } from '../../entities/product.entity';
import { plainToInstance } from 'class-transformer';
import { CategoryRepository } from '../category/category.repository';
import { ProductDetailRepository } from '../product-detail/product-detail.repository';
import * as fs from 'fs';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    private readonly repository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async getAllProduct(): Promise<ProductResponse> {
    const [products, totalCount] = await this.repository.getAllProduct();
    const productDtos = products.map(productDtoMap);
    return new ProductResponse(productDtos, 1, 10000, totalCount);
  }
  async createProduct(params: ProductCreateRequest): Promise<ProductEntity> {
    const { categoryId, ...productParams } = params;
    if (!categoryId) {
      throw new HttpException(
        COMMON_MESSAGE.CATEGORY_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new HttpException(
        COMMON_MESSAGE.CATEGORY_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }
    const productDb = plainToInstance(ProductEntity, {
      ...productParams,
      category,
    });
    return this.repository.save(productDb);
  }
  async updateProduct(
    id: number,
    params: ProductCreateRequest,
  ): Promise<ProductEntity> {
    const product = await this.repository.findOne({ where: { id } });
    const { categoryId } = params;
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (category) {
      params['category'] = category;
    }
    if (!product) {
      throw new HttpException(
        COMMON_MESSAGE.PRODUCT_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }
    const productData = plainToInstance(ProductEntity, {
      ...product,
      ...params,
    });
    return this.repository.save(productData);
  }

  async getProductByCategoryIdAndProductName(
    query: ProductQueryRequest,
  ): Promise<ProductResponse> {
    const { categoryId, productName } = query;

    if (!categoryId) {
      return new ProductResponse([], 1, 10000, 0);
    }

    const [products, totalCount] = await this.repository.findAndCount({
      where: {
        title: ILike(`%${productName || ''}%`),
        category: { id: +categoryId },
        isShow: true,
      },
      relations: ['category', 'productDetails'],
    });
    const productsDto: ProductDto[] = products.map(productDtoMap);
    return new ProductResponse(productsDto, 1, 10000, totalCount);
  }
  async getProductById(id: number): Promise<ProductEntity> {
    const product = await this.repository.getProductById(id);
    if (!product) {
      throw new HttpException(
        COMMON_MESSAGE.PRODUCT_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }
    return product;
  }
  async exportProductDetail(id: number): Promise<any> {
    const data = await this.repository.findOne({
      where: { id: id, productDetails: { isShow: true , isSale : false} },
      relations: ['productDetails'],
      select: { productDetails: { info: true, id: true } },
    });
    return data.productDetails.map((z) => z.info);
  }
}

function productDtoMap(z: ProductEntity) {
  return {
    id: z.id,
    title: z.title,
    category: { id: z.category.id, title: z.category.title },
    productDetails: z.productDetails.filter((z) => !z.isSale && z.isShow).length,
    createdAt: z.createdAt,
    isShow: z.isShow,
    price: z.price,
    description: z.description,
    subDescription: z.subDescription,
    orderNumber: z.orderNumber,
    updatedAt: z.updatedAt,
  };
}
