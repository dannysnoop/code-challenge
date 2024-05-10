import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { LicenseModule } from '../license/license.module';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    { provide: 'IUserService', useClass: UserService },
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
