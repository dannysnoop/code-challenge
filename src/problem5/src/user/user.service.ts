import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUserService } from './i.user.service';
import {
  ChangePasswordDto,
  CreateUserRequest,
  UpdateUserRequest,
  UserDto,
  UserRequest,
  UserResponse,
} from './DTO/user.dto';
import { Between, ILike, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../../entities/user.entity';
import * as ExcelJS from 'exceljs';
import {
  comparePassword,
  hashPassword,
  regexPassword,
} from '../../utility/handle-password';
import { COMMON_MESSAGE } from '../../helper/message';
import { UserLoginDto } from '../auth/DTO/user-login.dto';
import { getTimeYesterday } from '../../utility/handle-date';
import { generateRandomPassword, makeId } from '../../utility/random-character';
import * as moment from 'moment/moment';
import {
  generateRandomOTP,
  mailSendPassword,
  SendEmailResetPassword,
} from '../../utility/send-email-reset-password';


@Injectable()
export class UserService implements IUserService {
  constructor(
    private userRepository: UserRepository,
  ) {}

  async otpPassword(OTP: string): Promise<object> {
    const user = await this.userRepository.findOne({ where: { OTP } });
    if (!user) {
      throw new HttpException(COMMON_MESSAGE.OTP_WRONG, HttpStatus.FORBIDDEN);
    }
    const randomPassword = generateRandomPassword().toString();
    user.password = hashPassword(randomPassword);
    user.OTP = null;
    this.userRepository.save(user);

    mailSendPassword(user.email, randomPassword);
    return {
      message: 'Success',
      statusCode: 200,
    };
  }

  searchUserBySecretCode(secretCode = ''): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { secretCodeTransfer: secretCode },
    });
  }

  async activeAllUser(): Promise<void> {
    const users = await this.userRepository.find();
    users.forEach((item) => (item.isActive = true));
    await this.userRepository.save(users);
  }

  async genSecretCodeForTransfer(user: UserDto): Promise<object> {
    const userEntity = plainToInstance(UserEntity, user);
    const random = makeId(6);
    userEntity.secretCodeTransfer = random;
    this.userRepository.save(userEntity);
    return {
      message: random,
      statusCode: 200,
    };
  }

  async getAllNewUser(): Promise<UserResponse<UserDto>> {
    const [startYesterday, endYesterday, currentDate] = getTimeYesterday();
    const [users, total] = await this.userRepository.findAndCount({
      where: {
        createdAt: Between(endYesterday.toString(), currentDate.toString()),
      },
      select: {
        id: true,
        email: true,
        totalBalance: true,
        balance: true,
        device: true,
        lastLogin: true,
        ip: true,
        isActive: true,
        discount: true,
        createdAt: true,
        updatedAt: true,
        is2FA: true,
        username: true,
        phone: true,
      },
    });

    const yesterdayUserCount = await this.userRepository.count({
      where: {
        createdAt: Between(startYesterday.toString(), endYesterday.toString()),
      },
      select: {
        id: true,
      },
    });
    return new UserResponse(users, 1, 10000, total, yesterdayUserCount);
  }
  async exportExcelFileUser(params: UserRequest): Promise<ExcelJS.Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet 1');
    const userResponse = await this.getAllUser(params);
    const data = userResponse.data.map((z) => {
      z.createdAt = moment(+z.createdAt * 1000).format('DD/MM/YYYY hh:mm:ss');
      z.updatedAt = moment(+z.updatedAt * 1000).format('DD/MM/YYYY hh:mm:ss');
      return z;
    });
    const dataArray = [Object.keys(data[0])].concat(
      data.map((employee) => Object.values(employee)),
    );
    sheet.addRows(dataArray);
    return await workbook.xlsx.writeBuffer();
  }
  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    console.log('user' , id)

    if (!user) {
      throw new HttpException(
        COMMON_MESSAGE.USER_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }
    delete user.password;
    delete user.secretCodeTransfer;
    return user;
  }

  async getAllUser(queryParams: UserRequest): Promise<UserResponse<UserDto>> {
    const { ip, username, phone, page = 1, take = 10, role } = queryParams;
    const skip = (page - 1) * take || 0;
    const select = {
      id: true,
      email: true,
      totalBalance: true,
      balance: true,
      device: true,
      lastLogin: true,
      ip: true,
      isActive: true,
      discount: true,
      createdAt: true,
      updatedAt: true,
      is2FA: true,
      username: true,
      phone: true,
      role: true,
      license: { id: true, code: true, expireDate: true, activated: true },
    };

    if (!(username || ip || phone || role)) {
      const [users, total] = await this.userRepository.findAndCount({
        select,
        relations: {
          licenses: true,
        },
        skip,
        take,
        order: { id: 'DESC' },
      });

      return new UserResponse(users, page, take, total);
    }
    const whereCondition = {
      username: ILike(`%${(username && username.trim()) || ''}%`),
      phone: ILike(`%${(phone && phone.trim()) || ''}%`),
      ip: ip || null,
      role: role || null,
    };
    const [users, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      select,
      relations: {
        licenses: true,
      },
      skip,
      take,
      order: { id: 'DESC' },
    });

    return new UserResponse(users, page, take, total);
  }

  async createUser(params: CreateUserRequest): Promise<UserDto> {
    const user = plainToInstance(UserEntity, params);
    const checkUserExist = await this.userRepository.findOne({
      where: [{ email: user.email }, { phone: user.phone }],
    });
    if (checkUserExist) {
      throw new HttpException(
        COMMON_MESSAGE.EMAIL_EXISTED,
        HttpStatus.FORBIDDEN,
      );
    }
    user.password = hashPassword(params.password);
    try {
      const userData = await this.userRepository.save(user);
      return new UserDto(userData);
    } catch (e) {
      console.log(e);
    }
  }
  async updateUser(id: number, params: UpdateUserRequest): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id: +id },
      relations: {
        licenses: true,
      },
    });
    if (!user) {
      throw new HttpException(
        COMMON_MESSAGE.USER_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }

    const userEntity = await this.userRepository.save(user);
    return new UserDto(userEntity);
  }
  deleteUser(): void {
    throw new Error('Method not implemented.');
  }
  async resetPassword(email = '') {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        COMMON_MESSAGE.USER_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }
    const otp = generateRandomOTP();
    user.OTP = otp;
    this.userRepository.save(user);
    SendEmailResetPassword(email, otp);

    return {
      message: 'Success',
      statusCode: 200,
    };
  }

  async checkUserByEmailAndPassword(user: UserLoginDto) {
    const { username, password } = user;
    const userDb = await this.userRepository.findOne({
      where: [{ email: username }, { phone: username }],
    });
    if (!userDb) {
      throw new HttpException(COMMON_MESSAGE.LOGIN_FAIL, HttpStatus.FORBIDDEN);
    }
    const check = comparePassword(userDb.password, password);
    if (!check) {
      throw new HttpException(COMMON_MESSAGE.LOGIN_FAIL, HttpStatus.FORBIDDEN);
    }
    return new UserDto(userDb);
  }

  async changePassword(user: UserDto, params: ChangePasswordDto) {
    const { id } = user;
    const { currentPassword, newPassword } = params;
    const checkRegexPass = regexPassword(newPassword);
    if (!checkRegexPass) {
      throw new HttpException(
        COMMON_MESSAGE.PASSWORD_REGEX,
        HttpStatus.FORBIDDEN,
      );
    }
    const userEntity = await this.userRepository.findOne({ where: { id } });
    const checkPassword = comparePassword(userEntity.password, currentPassword);
    if (!checkPassword) {
      throw new HttpException(
        COMMON_MESSAGE.CURRENT_PASSWORD,
        HttpStatus.FORBIDDEN,
      );
    }
    userEntity.password = hashPassword(newPassword);
    this.userRepository.save(userEntity);
    return {
      status: 200,
      message: 'Success',
    };
  }

  async addBalanceForUser(user: UserEntity, amount: number): Promise<void> {
    user.balance += +amount;
    user.totalBalance += +amount;
    await this.userRepository.save(user);
  }

  async minusBalanceForUser(user: UserEntity, amount: number): Promise<void> {
    user.balance -= +amount;
    await this.userRepository.save(user);
  }
}
