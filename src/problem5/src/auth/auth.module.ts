import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { LicenseEntity } from "../../entities/lisence.entity";

@Module({
  imports: [PassportModule, forwardRef(() => UserModule),  TypeOrmModule.forFeature([LicenseEntity])],
  controllers: [AuthController],
  providers: [AuthService, { provide: 'IUserService', useClass: UserService }],
  exports: [AuthService],
})
export class AuthModule {}
