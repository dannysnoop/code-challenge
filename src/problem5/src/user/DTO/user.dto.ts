import { ROLE } from '../../../helper/constant';
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../entities/user.entity';
export class UserDto {
  id: number;
  username: string;
  device: string;
  role: ROLE;
  email: string;
  is2FA: boolean;
  createdAt: string;
  updatedAt: string;
  discount: number;
  constructor(user: UserEntity) {
    const {  balance, password, is2FA, device, ...data } = user;
    Object.assign(this, data);
  }
}

export class UserRequest {
  username = '';
  phone = '';
  ip = '';
  role: number;
  take = 10;
  page = 1;
}
export class UserResetPassRequest {
    @ApiProperty()
    email: string
}

export class UserOTPRequest {
  @ApiProperty()
  otp: string
}
export class UserResponse<T> {
  data: T[];
  totalRecord = 0;
  page = 0;
  limit = 0;
  currentPage = 1;
  yesterdayUser = 0
  constructor(
    data: T[],
    page = 0,
    take = 10,
    totalRecord = 0,
    yesterdayUser?,
  ) {
    this.data = data;
    this.limit = take;
    this.totalRecord = totalRecord;
    this.currentPage = page || 1;
    this.page = Math.ceil(totalRecord / take);
    this.yesterdayUser = yesterdayUser;
  }
}

export class CreateUserRequest {
  @ApiProperty()
  username: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  role: ROLE;
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
  @ApiProperty()
  is2FA: boolean;
  @ApiProperty()
  balance: number;
}

export class UpdateUserRequest {
  id: number
  @ApiProperty()
  code: string;
  @ApiProperty()
  activated: boolean;
  @ApiProperty()
  expireDate: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  currentPassword: string;
  @ApiProperty()
  newPassword: string;
}
