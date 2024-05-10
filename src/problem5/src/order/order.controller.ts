import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { IOrderService } from './i.order.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { COMMON_MESSAGE } from '../../helper/message';
import { CreateTransactionRequest, Pagination } from "../transaction/DTO/transaction.dto";
import { OrderCreateRequest, OrderQueryRequest } from './DTO/order.dto';
import { CurrentUser } from '../../decorator/user.decorator';
import { UserDto } from '../user/DTO/user.dto';
import { handleText } from '../../utility/handle-text';
import { IConfigWebService } from '../config-web/i.config-web.service';

@Controller('api/order')
@ApiTags('order')
export class OrderController {
  constructor(
    @Inject('IOrderService')
    private readonly IOrderService: IOrderService,

  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
  })
  @ApiBody({ type: OrderCreateRequest })
  createOrder(
    @CurrentUser() user: UserDto,
    @Body() params: OrderCreateRequest,
  ) {
    return this.IOrderService.createOrder(user, params);
  }

  @Get('/user-order-new')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  getUserOrderNew(@CurrentUser() user: UserDto) {
    return this.IOrderService.getTopNewOrder();
  }
  @Get('/user-order')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getUserOrder(@CurrentUser() user: UserDto, @Query() query: Pagination) {
    return this.IOrderService.getUserOrder(user, query);
  }

  @Get('/download-order/:id')
  async downloadOrder(@Param('id') id: number, @Res() res) {
    const fileName = `log_order_${id}.txt`;
    const data = await this.IOrderService.downloadDetailOrder(id);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(data);
  }
  @Get('/:id')
  getDetailOrder(@Param('id') id: number) {
    return this.IOrderService.getDetailOder(id);
  }


  @Get()
  @ApiQuery({ name: 'id', required: false, type: String })
  @ApiQuery({ name: 'username', required: false, type: String })
  @ApiQuery({ name: 'phone', required: false, type: String })
  @ApiQuery({ name: 'uid', required: false, type: String })
  @ApiQuery({ name: 'take', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String })
  getOrder(@Query() params: OrderQueryRequest) {
    return this.IOrderService.getAllOrder(params);
  }
}
