import { UserResponse } from '../../user/DTO/user.dto';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ProductEntity } from "../../../entities/product.entity";

export class ProductDto {
  id: number;
  title: string;
  description: string;
  subDescription: string;
  orderNumber: number;
  category: { id: number; title: string };
  price: number;
  isShow: boolean;
  createdAt: string;
  updatedAt: string;
  productDetails: number;
}

export class ProductResponse extends UserResponse<ProductDto> {}
export class ProductEntityResponse extends UserResponse<ProductEntity> {}

export class ProductCreateRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  subDescription: string;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price: number;
  @ApiProperty()
  quantityLimit: number;
  @ApiProperty()
  holeSale: number;
  @ApiProperty()
  categoryId: number;
  @ApiProperty()
  isShow: boolean;
  @ApiProperty()
  orderNumber: number;
}

export class ProductUpdateRequest extends ProductCreateRequest {}

export class ProductQueryRequest {
  categoryId: number;
  productName: string
}

export class ProductQueryCategoryIdAndProductNameRequest {
  productName: string;
}
