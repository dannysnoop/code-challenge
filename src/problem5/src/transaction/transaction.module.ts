import { forwardRef, Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigWebModule } from "../config-web/config-web.module";
import { ConfigWebService } from "../config-web/config-web.service";
import { ChatWsGatewayService } from "../websocket/websocket.gateway";


@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => ConfigWebModule)],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionRepository,
    { provide: 'IUserService', useClass: UserService },
    { provide: 'IConfigWebService', useClass: ConfigWebService },
    { provide: 'ITransactionService', useClass: TransactionService },
    ChatWsGatewayService
  ],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
