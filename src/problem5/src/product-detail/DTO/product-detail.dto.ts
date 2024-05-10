import { ProductEntity } from '../../../entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from '../../user/DTO/user.dto';

export class ProductDetailDto {
  info: string;
  isShow: boolean;
  createdAt: string;
  updatedAt: string;
  product: ProductEntity;
}

export class HistoryTransactionDTO {
  createdAt: string;
  productTitle: string;
  quantity: number;
}
export class HistoryTransactionResponse extends UserResponse<HistoryTransactionDTO> {}

export class ProductDetailResponse extends UserResponse<ProductDetailDto> {}

export class ProductDetailCreateRequest {
  @ApiProperty()
  lstInfo: string[];
  @ApiProperty()
  productId: number;
}

export class ProductDetailUpdateRequest {
  @ApiProperty()
  info: string;
  @ApiProperty()
  isShow: boolean;

  @ApiProperty()
  productId: number;
}

export class ProductDetailCreateResponse {
  lstNewProduct: string[];
  listUpdateProduct: string[];
  totalLine: number;
  failNumber: number;
  constructor(
    lstNewProduct: string[],
    listUpdateProduct: string[],
    totalLine: number,
    failNumber: number,
  ) {
    this.lstNewProduct = lstNewProduct;
    this.listUpdateProduct = listUpdateProduct;
    this.totalLine = totalLine;
    this.failNumber = failNumber;
  }
}

export class ProductSearchRequest {
  q: string;
  take = 10;
  page = 1;
}

export class UidRequest {
  uid: number;

}


export class U2FARequest {
  @ApiProperty()
  secrets: string[];
}
