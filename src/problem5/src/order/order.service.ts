import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IOrderService } from './i.order.service';
import { Buffer } from 'exceljs';
import { UserDto } from 'src/user/DTO/user.dto';
import {
  OrderCreateRequest,
  OrderDto,
  OrderQueryRequest,
  OrderResponse,
} from './DTO/order.dto';
import { OrderRepository } from './order.repository';
import { IProductService } from '../product/i.product.service';
import { OrderEntity } from '../../entities/order.entity';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../../entities/user.entity';
import { ORDER_STATUS } from '../../helper/constant';
import { IProductDetailService } from '../product-detail/i.product-details.service';
import { IUserService } from '../user/i.user.service';
import { ILike, In } from 'typeorm';
import { COMMON_MESSAGE } from '../../helper/message';
import { raw } from 'express';
import { handleText } from '../../utility/handle-text';
import { IConfigWebService } from '../config-web/i.config-web.service';
import { Pagination } from '../transaction/DTO/transaction.dto';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    private readonly repository: OrderRepository,
    @Inject('IProductService')
    private readonly IProductService: IProductService,
    @Inject('IProductDetailService')
    private readonly IProductDetailService: IProductDetailService,
    @Inject('IUserService')
    private readonly IUserService: IUserService,
    @Inject('IConfigWebService')
    private readonly IConfigWebService: IConfigWebService,
  ) {}

  async getTopNewOrder(): Promise<OrderDto[]> {
    const lstOrderEntity = await this.repository.find({
      relations: ['productDetails', 'product', 'user'],
      take: 13,
      order: { id: 'DESC' },
    });
    return lstOrderEntity.map(mapDataOrder);
  }
  async getAllOrder(query: OrderQueryRequest): Promise<OrderResponse> {
    const { uid, id, username, phone, page = 1, take = 10 } = query;
    const skip = (page - 1) * take || 0;
    let lstUid = (uid && uid.trim().replace('\t', '').split('\n')) || [];
    lstUid = lstUid.map(item => item.trim())
    const product =
      lstUid.length > 0
        ? { productDetails: { uid: In(lstUid) } }
        : { productDetails: true };
    const [data, totalCount] = await this.repository.findAndCount({
      where: {
        user: { username: ILike(`%${username || ''}%`), phone },
        id: id || null,
        product,
      },
      relations: ['user', 'product.productDetails', 'productDetails'],
      take,
      skip,
      order: {id: "desc"}
    });
    const orderDto = data.map(mapDataOrder);
    return new OrderResponse(orderDto, page, take, totalCount);
  }

  async getUserOrder(user: UserDto, query: Pagination): Promise<OrderResponse> {
    const { id } = user;
    const { page = 1, take = 10 } = query;
    const skip = (page - 1) * take || 0;
    const [orders, totalCount] = await this.repository.findAndCount({
      where: { user: { id } },
      relations: ['productDetails', 'product', 'user'],
      skip,
      take,
      order: { id: 'DESC' },
    });
    const orderDtos = orders.map(mapDataOrder);
    return new OrderResponse(orderDtos, page, take, totalCount);
  }
  async createOrder(
    user: UserDto,
    params: OrderCreateRequest,
  ): Promise<OrderEntity> {
    const { productId, quantity } = params;
    if (quantity == 0) return;
    const product = await this.IProductService.getProductById(productId);
    const totalPricePay =
      quantity * product.price * ((100 - user.discount) / 100);
    const userEntity = await this.IUserService.getUserById(user.id);
    if (userEntity.balance < totalPricePay) {
      throw new HttpException(
        COMMON_MESSAGE.MONEY_NOT_ENOUGH,
        HttpStatus.FORBIDDEN,
      );
    }
    const orderEntity = new OrderEntity();
    orderEntity.user = userEntity;
    orderEntity.product = product;
    orderEntity.quantity = quantity;
    orderEntity.totalPrice = totalPricePay;
    orderEntity.status = ORDER_STATUS.SUCCESS;
    const data = await this.repository.save(orderEntity);
    await this.IUserService.minusBalanceForUser(userEntity, totalPricePay);
    await this.IProductDetailService.saleProduct(product, quantity, data);
    delete data.user;
    delete data.product.productDetails;
    return data;
  }
  async getDetailOder(orderId: number): Promise<OrderDto> {
    const data = await this.repository.findOne({
      where: { id: orderId },
      relations: ['productDetails', 'product'],
    });

    if (!data) {
      throw new HttpException(
        COMMON_MESSAGE.ORDER_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }

    return mapDataOrder(data);
  }
  async downloadDetailOrder(orderId: number): Promise<string> {
    const data = await this.getDetailOder(orderId);
    const config = await this.IConfigWebService.getConfig();
    const textConfig = config.contentTXTDownload;
    return handleText(data) + textConfig + '\n\n' + data.info.join('\n');
  }
}

function mapDataOrder(data: OrderEntity): OrderDto {
  return {
    id: data.id,
    username: data.user?.username,
    info: data.productDetails.map((z) => z.info),
    uid: data.productDetails.map((z) => z.uid),
    productName: data.product.title,
    quantity: data.quantity,
    totalPrice: data.totalPrice,
    createdDate: data.createdAt,
  };
}
