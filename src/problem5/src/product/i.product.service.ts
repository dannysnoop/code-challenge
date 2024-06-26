import {
  ProductCreateRequest,
  ProductDto,
  ProductEntityResponse,
  ProductQueryRequest,
  ProductResponse,
} from './DTO/product.dto';
import { ProductEntity } from '../../entities/product.entity';
import { ProductService } from "./product.service";

export interface IProductService {
  getAllProduct(): Promise<ProductResponse>;
  createProduct(params: ProductCreateRequest): Promise<ProductEntity>;
  getProductByCategoryIdAndProductName(
    query: ProductQueryRequest,
  ): Promise<ProductResponse>;
  updateProduct(
    id: number,
    params: ProductCreateRequest,
  ): Promise<ProductEntity>;
  getProductById(id: number): Promise<ProductEntity>;
  exportProductDetail(id: number): Promise<any>;


}
