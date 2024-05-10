import { UserResponse } from '../../user/DTO/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  id: number;
  createdDate: string;
  username: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  info: string[];
  uid: string[]
}

export class OrderResponse extends UserResponse<OrderDto> {}

export class OrderCreateRequest {
  @ApiProperty()
  productId: number;
  @ApiProperty()
  quantity: number;
}

export class OrderQueryRequest {
  id: number;
  username: string;
  phone: string;
  uid: string;
  take: number
  page: number
}
