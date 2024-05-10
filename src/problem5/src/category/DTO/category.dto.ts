import { UserResponse } from '../../user/DTO/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  id: number;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  icon: string;
  isShow: boolean;
}



export class CategoryResponse extends UserResponse<CategoryDto> {}

export class CategoryCreateRequest {
  @ApiProperty()
  title: string;
  @ApiProperty()
  isShow: boolean;
  @ApiProperty()
  order: number;
  @ApiProperty()
  icon: string;
}

export class CategoryQueryRequest {
  q: string
}

export class CategorySearchQueryRequest {
  productName: string
}

export class CategoryUpdateRequest extends CategoryCreateRequest{}
