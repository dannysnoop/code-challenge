import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ITransactionService } from './i.transaction.service';
import {
  CreateTransactionRequest,
  Pagination,
  TransactionDto,
  TransactionNewestDto,
  TransactionOrderQueryStatistic,
  TransactionOrderStatistic,
  TransactionQueryDate,
  TransactionRequest,
  TransactionResponse,
  TransactionStatistic,
  TransactionTop10,
} from './DTO/transaction.dto';
import { TransactionRepository } from './transaction.repository';
import { Between, ILike } from 'typeorm';
import { UserDto } from '../user/DTO/user.dto';
import { IUserService } from '../user/i.user.service';
import { plainToInstance } from 'class-transformer';
import { TransactionsEntity } from '../../entities/transactions.entity';
import { UserEntity } from '../../entities/user.entity';
import * as moment from 'moment';
import * as process from 'process';
import { DEPOSIT } from '../../helper/constant';
import { use } from 'passport';
import { IConfigWebService } from '../config-web/i.config-web.service';
import { COMMON_MESSAGE } from '../../helper/message';
import { ChatWsGatewayService } from '../websocket/websocket.gateway';

const today = moment();
@Injectable()
export class TransactionService implements ITransactionService {
  constructor(
    private repository: TransactionRepository,
    @Inject('IUserService') private readonly IUserService: IUserService,
    private readonly chatWsGatewayService: ChatWsGatewayService,
  ) {

  }

  async autoCreateTransaction(
    secretCode = '',
    amount = 0,
    depositBank = 3,
  ): Promise<TransactionDto> {
    try {
      const user = await this.IUserService.searchUserBySecretCode(secretCode);
      if (!user) {
          return
      }
      const { secretCodeTransfer } = user;
      if (secretCode === secretCodeTransfer) {
        await this.IUserService.addBalanceForUser(user, amount);
        const transaction = new TransactionsEntity();
        transaction.user = user;
        transaction.type = DEPOSIT.VP;
        transaction.amount = amount;
        transaction.description = user.username + ' Tự nạp tiền';
        transaction.code =
          'VP ' + `${Math.floor(Math.random() * 1000000000) + 1}`;
         this.chatWsGatewayService.autoSendAmountToClient(amount, user.id);
        return this.repository.save(transaction);
      }
      return null;
    } catch (e) {
      console.warn(e);
    }
  }

  async getNewTransaction(): Promise<TransactionNewestDto[]> {
    const transactionNewest = await this.repository.find({
      select: { user: { username: true, id: true } },
      relations: ['user'],
      order: { id: 'DESC' },
      take: 13,
    });

    return transactionNewest.map(transactionNewestMap);
  }

  async getUserSelfDeposit(userAdmin: UserDto): Promise<TransactionResponse> {
    const { id } = userAdmin;

    const startOfMonth = today.startOf('month').unix();

    // Get the end of the current month
    const endOfMonth = today.endOf('month').unix();
    const [data, totalCount] = await this.repository.findAndCount({
      where: {
        user: { id },
        createdAt: Between(startOfMonth.toString(), endOfMonth.toString()),
      },
      select: { user: { username: true, id: true } },
      relations: ['user'],
      order: { id: 'DESC' },
    });
    return new TransactionResponse(data, 1, 100000, totalCount);
  }

  async getStatisticsForAdmin(
    query: TransactionQueryDate,
  ): Promise<TransactionOrderStatistic | TransactionOrderQueryStatistic> {
    const { startDate, endDate } = query;
    if (!startDate && !endDate) {
      const data = await this.repository.query(`

 SELECT   sum(amount) as total
 FROM transactions a
 WHERE EXTRACT(WEEK FROM TO_TIMESTAMP(cast(a."createdAt" as bigint))) = EXTRACT(WEEK FROM CURRENT_DATE)
 union all

 SELECT  sum(amount) as total
 FROM transactions a
 WHERE DATE_PART('month', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('month', CURRENT_DATE)
 AND DATE_PART('year', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('year', CURRENT_DATE) union all

 SELECT  sum(amount) as total
 FROM transactions a
 WHERE   DATE_PART('year', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('year', CURRENT_DATE) union all

SELECT   sum(a."totalPrice") as total
 FROM orders a
  WHERE DATE_PART('month', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('month', CURRENT_DATE)
 AND DATE_PART('year', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('year', CURRENT_DATE)
 union all


  SELECT   sum(a."totalPrice") as total
 FROM orders a
 WHERE EXTRACT(WEEK FROM TO_TIMESTAMP(cast(a."createdAt" as bigint))) = EXTRACT(WEEK FROM CURRENT_DATE)
 union all

 SELECT   sum(a."totalPrice") as total
 FROM orders a
  WHERE  DATE_PART('year', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('year', CURRENT_DATE)`);

      return {
        totalAmountDepositWeek: data[0].total,
        totalAmountDepositMonth: data[1].total,
        totalAmountDepositYear: data[2].total,
        totalAmountWithdrawWeek: data[3].total,
        totalAmountWithdrawMonth: data[4].total,
        totalAmountWithdrawYear: data[5].total,
      };
    }
    const data = await this.repository.query(` SELECT   sum(amount) as total
 FROM transactions a
 WHERE TO_TIMESTAMP(cast(a."createdAt" as bigint)) between to_timestamp(${startDate}) and to_timestamp(${endDate})
 union all
 SELECT   sum(a."totalPrice") as total
 FROM orders a
  WHERE TO_TIMESTAMP(cast(a."createdAt" as bigint)) between to_timestamp(${startDate}) and to_timestamp(${endDate})`);

    return {
      totalAmountDeposit: data[0].total || 0,
      totalAmountWithdraw: data[1].total,
    };
  }

  async getTransactionByUsernameOrCode(
    params: TransactionRequest,
  ): Promise<TransactionResponse> {
    const { username, take = 10, page = 1, code } = params;
    const skip = (page - 1) * take || 0;
    const [data, totalCount] = await this.repository.findAndCount({
      where: {
        code: ILike(`%${code || ''}%`),
        user: { username: ILike(`%${username || ''}%`) },
      },
      select: { user: { username: true, id: true } },
      relations: ['user'],
      take,
      skip,
      order: { id: 'desc' },
    });
    return new TransactionResponse(data, page, take, totalCount);
  }
  async createTransaction(
    userAdmin: UserDto,
    params: CreateTransactionRequest,
  ): Promise<TransactionDto> {
    const { userId, ...paramsTransaction } = params;
    const user = await this.IUserService.getUserById(userId);
    paramsTransaction.adminNameHandle = userAdmin.username;
    const userEntity = plainToInstance(UserEntity, user);
    await this.IUserService.addBalanceForUser(
      userEntity,
      paramsTransaction.amount,
    );

    const transactionSave = plainToInstance(TransactionsEntity, {
      ...paramsTransaction,
      user: userEntity,
    });
    return await this.repository.save(transactionSave);
  }
  async getTop10InMonth(): Promise<TransactionTop10[]> {
    return this.repository.query(`
select total, username from (SELECT  sum(amount) as total, "userId"
FROM transactions a
WHERE DATE_PART('month', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('month', CURRENT_DATE)
AND DATE_PART('year', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('year', CURRENT_DATE) group by "userId" order by total desc limit  10) as t inner join users u on t."userId" = u.id order by total DESC;`);
  }
  async getStatistics(): Promise<TransactionStatistic> {
    const data = await this.repository.query(` SELECT  sum(amount) as total
 FROM transactions a
 WHERE DATE(TO_TIMESTAMP(cast(a."createdAt" as bigint))) = CURRENT_DATE - INTERVAL '1 day'
 union all
 SELECT  sum(amount) as total
 FROM transactions a
 WHERE DATE(TO_TIMESTAMP(cast(a."createdAt" as bigint))) = CURRENT_DATE
 union all

 SELECT   sum(amount) as total
 FROM transactions a
 WHERE EXTRACT(WEEK FROM TO_TIMESTAMP(cast(a."createdAt" as bigint))) = EXTRACT(WEEK FROM CURRENT_DATE)
 union all

 SELECT  sum(amount) as total
 FROM transactions a
 WHERE DATE_PART('month', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('month', CURRENT_DATE)
 AND DATE_PART('year', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('year', CURRENT_DATE) union all
select count(*) from orders  a  WHERE DATE(TO_TIMESTAMP(cast(a."createdAt" as bigint))) = CURRENT_DATE - INTERVAL '1 day' union all
select count(*) from orders  a  WHERE DATE(TO_TIMESTAMP(cast(a."createdAt" as bigint))) = CURRENT_DATE  union all
select count(*) from orders  a  WHERE EXTRACT(WEEK FROM TO_TIMESTAMP(cast(a."createdAt" as bigint))) = EXTRACT(WEEK FROM CURRENT_DATE)  union all
select count(*) from orders  a   WHERE DATE_PART('month', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('month', CURRENT_DATE)
 AND DATE_PART('year', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('year', CURRENT_DATE)  union all
select sum(a."totalPrice") from orders  a  WHERE DATE(TO_TIMESTAMP(cast(a."createdAt" as bigint))) = CURRENT_DATE - INTERVAL '1 day'  union all
select sum(a."totalPrice") from orders  a  WHERE DATE(TO_TIMESTAMP(cast(a."createdAt" as bigint))) = CURRENT_DATE  union all
select sum(a."totalPrice") from orders  a  WHERE EXTRACT(WEEK FROM TO_TIMESTAMP(cast(a."createdAt" as bigint))) = EXTRACT(WEEK FROM CURRENT_DATE)  union all
select sum(a."totalPrice") from orders  a  WHERE DATE_PART('month', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('month', CURRENT_DATE)
 AND DATE_PART('year', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('year', CURRENT_DATE);`);
    return {
      totalAmountYesterday: data[0].total || 0,
      totalAmountToday: data[1].total || 0,
      totalAmountThisWeek: data[2].total || 0,
      totalAmountThisMonth: data[3].total || 0,
      totalOrderYesterday: data[4].total || 0,
      totalOrderToday: data[5].total || 0,
      totalOrderThisWeek: data[6].total || 0,
      totalOrderThisMonth: data[7].total || 0,
      totalOrderAmountYesterday: data[8].total || 0,
      totalOrderAmountToday: data[9].total || 0,
      totalOrderAmountThisWeek: data[10].total || 0,
      totalOrderAmountThisMonth: data[11].total || 0,
    };
  }
  async getTransactionByUser(
    userAdmin: UserDto,
    pagination: Pagination,
  ): Promise<TransactionResponse> {
    const { take, page } = pagination;
    const skip = (page - 1) * take || 0;
    const [data, totalCount] = await this.repository.findAndCount({
      where: { user: { id: userAdmin.id } },
      skip,
      take,
      order: { id: 'DESC' },
    });
    return new TransactionResponse(data, page, take, totalCount);
  }
}

function transactionNewestMap(item: TransactionsEntity): TransactionNewestDto {
  return {
    code: item.code,
    amount: item.amount,
    createdAt: item.createdAt,
    description: item.description,
    username: item.user.username,
    depositType: item.type,
  };
}
