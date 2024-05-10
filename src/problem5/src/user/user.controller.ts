import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IUserService } from './i.user.service';
import {
  ChangePasswordDto,
  CreateUserRequest,
  UpdateUserRequest,
  UserDto, UserOTPRequest,
  UserRequest,
  UserResetPassRequest
} from "./DTO/user.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { COMMON_MESSAGE } from '../../helper/message';
import { CurrentUser } from '../../decorator/user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from '../../decorator/roles.decorator';
import { ROLE } from '../../helper/constant';
import { getDDMMYYYCurrentDate } from '../../utility/handle-date';


@Controller('api/user')
@ApiTags('users')
@ApiBearerAuth()
// @UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(
    @Inject('IUserService') private readonly IUserService: IUserService,
  ) {}

  @Get('/new-user')
  getAllNewUser() {
    return this.IUserService.getAllNewUser();
  }

  @Post('/reset-pass')
  @ApiBody({ type: UserResetPassRequest })
  resetPassword(@Body() params: UserResetPassRequest) {
    const { email } = params;
    return this.IUserService.resetPassword(email);
  }

  @Post('/confirm-otp')
  @ApiBody({ type: UserOTPRequest })
  OTPPassword(@Body() params: UserOTPRequest) {
    const { otp } = params;
    return this.IUserService.otpPassword(otp);
  }
  @Get()
  @ApiQuery({ name: 'phone', required: false, type: String })
  @ApiQuery({ name: 'ip', required: false, type: String })
  @ApiQuery({ name: 'username', required: false, type: String })
  @ApiQuery({ name: 'take', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @Roles(ROLE.MEMBER)
  getAllUser(@Query() query: UserRequest) {
    return this.IUserService.getAllUser(query);
  }

  @Post('/excel-user')
  @ApiBody({ type: UserRequest })
  async getUsersByExcel(@Body() query: UserRequest, @Res() res) {
    const excelBuffer = await this.IUserService.exportExcelFileUser(query);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=user-${getDDMMYYYCurrentDate()}.xlsx`,
    );
    res.send(excelBuffer);
  }

  @Post('/active-all')
  activeAllUser() {
    return this.IUserService.activeAllUser();
  }

  @Post()
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
    type: UserDto,
  })
  @ApiBody({ type: CreateUserRequest })
  createUser(@Body() params: CreateUserRequest) {
    return this.IUserService.createUser(params);
  }

  @Put('/change-password')
  @UseGuards(AuthGuard)
  changePassword(
    @CurrentUser() user: UserDto,
    @Body() changePasswordParams: ChangePasswordDto,
  ) {
    return this.IUserService.changePassword(user, changePasswordParams);
  }

  @Put('/:id')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
    type: UserDto,
  })
  updateUser(@Param('id') id: number, @Body() params: UpdateUserRequest) {
    return this.IUserService.updateUser(id, params);
  }
  @Get('/current-user')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
    type: UserDto,
  })
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() user: UserDto) {
    const { id } = user;
    return this.IUserService.getUserById(+id);
  }
  @Get('/:id')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
    type: UserDto,
  })
  getUserById(@Param('id') id: number) {
    return this.IUserService.getUserById(+id);
  }

  @Post('/user-scretcode')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
    type: UserDto,
  })
  @UseGuards(AuthGuard)
  getSecretCode(@CurrentUser() user: UserDto) {
    return this.IUserService.genSecretCodeForTransfer(user);
  }
}
