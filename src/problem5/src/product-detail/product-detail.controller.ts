import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IProductDetailService } from './i.product-details.service';
import { ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";
import {
  ProductDetailCreateRequest,
  ProductDetailUpdateRequest,
  ProductSearchRequest,
  U2FARequest,
  UidRequest,
} from './DTO/product-detail.dto';
import { Pagination } from '../transaction/DTO/transaction.dto';
import { UserResetPassRequest } from "../user/DTO/user.dto";

@Controller('api/product-detail')
@ApiTags('product-detail')
export class ProductDetailController {
  constructor(
    @Inject('IProductDetailService')
    private readonly IProductDetailService: IProductDetailService,
  ) {}

  @Post()
  importExcelProductDetail(@Body() params: ProductDetailCreateRequest) {
    return this.IProductDetailService.importProductDetail(params);
  }
  @Get()
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  getProductDetail(@Query() params: ProductSearchRequest) {
    return this.IProductDetailService.getProductDetail(params);
  }

  @Get('check-live-uid')
  @ApiQuery({ name: 'uid', required: false, type: String })
  checkLiveUid(@Query() params: UidRequest) {
    return this.IProductDetailService.checkLiveUid(params.uid);
  }

  @Post('check-2fa')
  @ApiBody({ type: U2FARequest })
  check2FA(@Body() params: U2FARequest) {
    return this.IProductDetailService.gen2FaCode(params.secrets);
  }
  @Get('history-transaction')
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  getHistoryTransaction(@Query() params: Pagination) {
    return this.IProductDetailService.getHistoryTransaction(params);
  }

  @Get('/:id')
  getProductDetailById(@Param('id') id: number) {
    return this.IProductDetailService.getProductDetailById(id);
  }

  @Put('/:id')
  updateProductDetail(
    @Param('id') id: number,
    @Body() params: ProductDetailUpdateRequest,
  ) {
    return this.IProductDetailService.updateProductDetail(id, params);
  }

  @Delete('/:id')
  removeProductDetail(@Param('id') id: number) {
    return this.IProductDetailService.removeProductDetail(id);
  }
}
