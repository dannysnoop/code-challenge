import { Inject, Injectable } from '@nestjs/common';
const jwt = require('jsonwebtoken');
import { UserLoginDto } from './DTO/user-login.dto';
import { IUserService } from '../user/i.user.service';
import * as process from 'process';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserService') private readonly IUserService: IUserService,
  ) {}

  async validateUser(userLogin: UserLoginDto) {
    const data = await this.IUserService.checkUserByEmailAndPassword(userLogin);
    const access_token = jwt.sign({ ...data }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return {
      access_token,
    };
  }
}
