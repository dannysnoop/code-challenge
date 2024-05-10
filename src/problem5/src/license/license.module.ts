import { forwardRef, Module } from '@nestjs/common';
import { LicenseController } from './license.controller';
import { LicenseService } from './license.service';
import { LicenseRepository } from './license.repository';
import { UserModule } from '../user/user.module';
import { ProductService } from '../product/product.service';
import { IUserService } from '../user/i.user.service';
import { UserService } from '../user/user.service';
import { ILicenseService } from './i.license.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [LicenseController],
  providers: [
    LicenseService,
    LicenseRepository,
    { provide: 'IUserService', useClass: UserService },
    { provide: 'ILicenseService', useClass: LicenseService },
  ],
  exports: [LicenseService, LicenseRepository],
})
export class LicenseModule {}
