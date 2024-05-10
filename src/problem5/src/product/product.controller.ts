import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res, UseGuards
} from "@nestjs/common";
import { IProductService } from './i.product.service';
import {
  ProductCreateRequest,
  ProductQueryRequest,
  ProductUpdateRequest,
} from './DTO/product.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../guards/auth.guard";

@Controller('api/product')
@ApiTags('product')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ProductController {
  constructor(
    @Inject('IProductService')
    private readonly IProductService: IProductService,
  ) {}

  @Post('/:id')
  async exportTxtFileDetailProduct(@Param('id') id: number, @Res() res) {
    try {
      const fileName = 'data.txt';
      const data = await this.IProductService.exportProductDetail(id);
      const stringWithLineBreaks = data.join('\n');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );
      res.setHeader('Content-Type', 'text/plain');
      res.send(stringWithLineBreaks);
    } catch (error) {
      res.status(500).send(`Error generating JSON: ${error}`);
    }
  }
  @Get('/client')
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'productName', required: false, type: String })
  getProductForClient(@Query() query: ProductQueryRequest) {
    return this.IProductService.getProductByCategoryIdAndProductName(query);
  }
  @Get()
  getAllProduct() {
    return this.IProductService.getAllProduct();
  }

  @Get('/:id')
  getProductById(@Param('id') id: number) {
    return this.IProductService.getProductById(id);
  }
  @Post()
  createProduct(@Body() params: ProductCreateRequest) {
    return this.IProductService.createProduct(params);
  }

  @Put('/:id')
  updateProduct(@Param('id') id: number, @Body() params: ProductUpdateRequest) {
    return this.IProductService.updateProduct(id, params);
  }
}
