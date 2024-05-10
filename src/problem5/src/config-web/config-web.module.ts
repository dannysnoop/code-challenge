import { Module } from '@nestjs/common';
import { ConfigWebController } from './config-web.controller';
import { ConfigWebService } from './config-web.service';
import { ConfigWebRepository } from './config-web.repository';
import { OrderService } from '../order/order.service';

@Module({
  controllers: [ConfigWebController],
  providers: [
    ConfigWebService,
    ConfigWebRepository,
    { provide: 'IConfigWebService', useClass: ConfigWebService },
  ],
  exports: [ConfigWebService, ConfigWebRepository],
})
export class ConfigWebModule {}
