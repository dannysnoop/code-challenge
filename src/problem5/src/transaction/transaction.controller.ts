import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  OnModuleInit,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ITransactionService } from './i.transaction.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateTransactionRequest,
  TransactionQueryDate,
  TransactionRequest,
} from './DTO/transaction.dto';
import { COMMON_MESSAGE } from '../../helper/message';
import { CurrentUser } from '../../decorator/user.decorator';
import { UserDto } from '../user/DTO/user.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorator/roles.decorator';
import { ROLE } from '../../helper/constant';
import { emailAndPasswordImap } from '../../utility/mail-bank-listen';
import { IConfigWebService } from '../config-web/i.config-web.service';
import { checkUserActiveStatus } from "../../utility/check-live-uid";

@Controller('api/transaction')
@ApiTags('transaction')
export class TransactionController implements OnModuleInit {
  constructor(
    @Inject('ITransactionService')
    private readonly ITransactionService: ITransactionService,
    @Inject('IConfigWebService')
    private readonly IConfigWebService: IConfigWebService,
  ) {}

  async onModuleInit() {
    const { ACB_AccountPass, adminEmail, SyntaxTransfer } =
      await this.IConfigWebService.getConfig();

    const a = await checkUserActiveStatus(100040774575842)
    // console.log(a)

    // emailAndPasswordImap(
    //   { user: adminEmail, password: ACB_AccountPass },
    //   this.ITransactionService,
    //   SyntaxTransfer
    // );
  }

  @Get()
  @ApiQuery({ name: 'username', required: false, type: String })
  @ApiQuery({ name: 'code', required: false, type: String })
  @ApiQuery({ name: 'take', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String })
  async getTransactionByUserNameAndCode(@Query() query: TransactionRequest) {
    return this.ITransactionService.getTransactionByUsernameOrCode(query);
  }
  @Post()
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
  })
  @ApiBody({ type: CreateTransactionRequest })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async createTransaction(
    @CurrentUser() user: UserDto,
    @Body() params: CreateTransactionRequest,
  ) {
    return this.ITransactionService.createTransaction(user, params);
  }

  @Get('/get-top-10-deposit')
  async getTop10Deposit() {
    return this.ITransactionService.getTop10InMonth();
  }

  @Get('/get-newest-deposit')
  async getNewestDeposit() {
    return this.ITransactionService.getNewTransaction();
  }

  @Get('/user-deposit')
  @ApiQuery({ name: 'take', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  async getUserDeposit(
    @CurrentUser() user: UserDto,
    @Query() pagination: TransactionRequest,
  ) {
    return this.ITransactionService.getTransactionByUser(user, pagination);
  }

  @Get('/user-self-deposit')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getUserSelfDeposit(@CurrentUser() user: UserDto) {
    return this.ITransactionService.getUserSelfDeposit(user);
  }
  @Get('/statistics')
  async getStatistics() {
    return this.ITransactionService.getStatistics();
  }

  @Get('/statistics-admin')
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getAdminStatistics(@Query() query: TransactionQueryDate) {
    return this.ITransactionService.getStatisticsForAdmin(query);
  }
}
