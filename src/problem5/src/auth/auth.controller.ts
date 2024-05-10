import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from './auth.service';
import { ApiBody, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { UserLoginDto } from "./DTO/user-login.dto";
import { COMMON_MESSAGE } from "../../helper/message";
import { CreateUserRequest, UserDto } from "../user/DTO/user.dto";

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  @Post()
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
    type: UserLoginDto,
  })
  @ApiBody({ type: UserLoginDto })
  login(@Body() login: UserLoginDto) {
    return this.authService.validateUser(login);
  }
}
