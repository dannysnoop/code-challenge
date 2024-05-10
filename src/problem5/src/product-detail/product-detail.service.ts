import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IProductDetailService } from './i.product-details.service';
import {
  ProductDetailCreateRequest,
  ProductDetailCreateResponse,
  ProductSearchRequest,
  ProductDetailUpdateRequest,
  ProductDetailDto,
  ProductDetailResponse,
  HistoryTransactionDTO,
  HistoryTransactionResponse,
} from './DTO/product-detail.dto';
import { ProductDetailRepository } from './product-detail.repository';
import { ProductDetailEntity } from '../../entities/product-detail.entity';
import { IProductService } from '../product/i.product.service';
import { COMMON_MESSAGE } from '../../helper/message';
import { DeleteResult, ILike, In, Repository } from 'typeorm';
import { difference } from 'lodash';
import { plainToInstance } from 'class-transformer';
import { ProductEntity } from 'entities/product.entity';
import { OrderEntity } from '../../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryTransactionEntity } from '../../entities/history-transaction.entity';
import { Pagination } from 'src/transaction/DTO/transaction.dto';
import { checkUserActiveStatus } from '../../utility/check-live-uid';
import { totp } from 'otplib';
@Injectable()
export class ProductDetailService implements IProductDetailService {
  constructor(
    private readonly repository: ProductDetailRepository,
    @Inject('IProductService')
    private readonly IProductService: IProductService,
    @InjectRepository(HistoryTransactionEntity)
    private historyTransactionEntityRepository: Repository<HistoryTransactionEntity>,
  ) {}

  async checkLiveUid(uid: number): Promise<boolean> {
    return checkUserActiveStatus(uid);
  }
  async gen2FaCode(
    secrets: string[],
  ): Promise<{ key: string; value: string }[]> {
    return secrets.map((z) => {
      return { key: z, value: totp.generate(z) };
    });
  }

  async getProductDetailById(id: number): Promise<ProductDetailDto> {
    const data = await this.repository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!data) {
      throw new HttpException(
        COMMON_MESSAGE.PRODUCT_DETAIL_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }
    return data;
  }

  async getHistoryTransaction(pagination: Pagination) {
    const { page, take } = pagination;
    const skip = (page - 1) * take || 0;
    const [data, totalCount] =
      await this.historyTransactionEntityRepository.findAndCount({
        take,
        skip,
        relations: ['product'],
      });
    const res = data.map(mapHistoryProductDetail);
    return new HistoryTransactionResponse(res, page, take, totalCount);
  }

  saleProduct = async (
    product: ProductEntity,
    quantity: number,
    order: OrderEntity,
  ) => {
    const productDetails = product.productDetails;
    if (quantity > productDetails.filter((z) => !z.isSale).length) {
      throw new HttpException(
        COMMON_MESSAGE.OUT_OF_STOCK,
        HttpStatus.FORBIDDEN,
      );
    }
    for (let i = 0; i < quantity; i++) {
      const index = productDetails.findIndex((item) => item.isSale == false);
      productDetails[index].isSale = true;
      productDetails[index].order = order;
    }
    await this.repository.save(productDetails);
  };
  async importProductDetail(
    productDetailCreateRequest: ProductDetailCreateRequest,
  ): Promise<ProductDetailCreateResponse> {
    const { lstInfo, productId } = productDetailCreateRequest;

    const product = await this.IProductService.getProductById(productId);
    if (!product) {
      throw new HttpException(
        COMMON_MESSAGE.PRODUCT_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }
    const infoLst = [...new Set(lstInfo)];
    const lstProductDetailExisted = await this.repository.find({
      where: { info: In(infoLst) },
      select: { info: true, id: true },
    });
    const lstInfoExisted = lstProductDetailExisted.map((z) => z.info);
    const dataInfo = difference(lstInfo, lstInfoExisted);
    const lstProductDetails: ProductDetailEntity[] = [];
    dataInfo.forEach((info: string) => {
      const productDetail = new ProductDetailEntity();
      productDetail.info = info;
      productDetail.isShow = true;
      productDetail.product = product;
      productDetail.order = null;
      lstProductDetails.push(productDetail);
    });
    const historyEntity = new HistoryTransactionEntity();
    if (dataInfo.length != 0) {
      historyEntity.product = product;
      historyEntity.quantity = dataInfo.length;
      await this.historyTransactionEntityRepository.save(historyEntity);
    }
    await this.repository.save(lstProductDetails);
    return new ProductDetailCreateResponse(
      dataInfo,
      lstInfoExisted,
      lstInfo.length,
      0,
    );
  }
  async getProductDetail(
    query: ProductSearchRequest,
  ): Promise<ProductDetailResponse> {
    const { q, take = 10, page = 1 } = query;
    const skip = (page - 1) * take || 0;
    const [data, totalCount] = await this.repository.findAndCount({
      where: { uid: ILike(`%${q || ''}%`), isShow: true, isSale: false },
      relations: ['product'],
      select: { product: { title: true } },
      take,
      skip,
    });

    return new ProductDetailResponse(data, page, take, totalCount);
  }
  async updateProductDetail(
    id: number,
    params: ProductDetailUpdateRequest,
  ): Promise<ProductDetailDto> {
    const { isShow, info, productId } = params;
    const productDetail = await this.repository.findOneByOrFail({ id });
    if (!productDetail) {
      throw new HttpException(
        COMMON_MESSAGE.PRODUCT_DETAIL_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }
    const product = await this.IProductService.getProductById(productId);
    if (product) {
      productDetail.product = product;
    }

    const dataProductSave = plainToInstance(ProductDetailEntity, {
      ...productDetail,
      ...params,
    });
    return this.repository.save(dataProductSave);
  }
  async removeProductDetail(id: number): Promise<any> {
    await this.repository.delete(id);
  }
}

function mapHistoryProductDetail(
  historyMapEntity: HistoryTransactionEntity,
): HistoryTransactionDTO {
  return {
    productTitle: historyMapEntity.product.title,
    quantity: historyMapEntity.quantity,
    createdAt: historyMapEntity.createdAt,
  };
}
