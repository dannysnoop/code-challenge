import { TransactionsEntity } from '../../../entities/transactions.entity';
import { UserResponse } from '../../user/DTO/user.dto';
import { Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../../../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { DEPOSIT } from "../../../helper/constant";

export class TransactionDto extends TransactionsEntity {}

export class TransactionNewestDto {
  amount = 0;
  description = '';
  username = '';
  code = '';
  depositType = DEPOSIT.DEFAULT;
  createdAt = '';
}

export class TransactionResponse extends UserResponse<TransactionDto> {}

export class TransactionRequest {
  code: string;
  username: string;
  take = 10;
  page = 1;
}

export class Pagination {
  take = 10;
  page = 1;
}

export class CreateTransactionRequest {
  @ApiProperty()
  amount: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  adminNameHandle: string;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  type: DEPOSIT;
}

export class TransactionTop10 {
  total = 0;
  username = '';
}
export class TransactionQueryDate {
  startDate: string;
  endDate: string;
}

export class TransactionStatistic {
  totalAmountYesterday = 0;
  totalAmountToday = 0;
  totalAmountThisWeek = 0;
  totalAmountThisMonth = 0;
  totalOrderYesterday = 0;
  totalOrderAmountYesterday = 0;
  totalOrderToday = 0;
  totalOrderAmountToday = 0;
  totalOrderThisWeek = 0;
  totalOrderAmountThisWeek = 0;
  totalOrderThisMonth = 0;
  totalOrderAmountThisMonth = 0;
}

export class TransactionOrderStatistic {
  totalAmountDepositWeek = 0;
  totalAmountDepositMonth = 0;
  totalAmountDepositYear = 0;
  totalAmountWithdrawWeek = 0;
  totalAmountWithdrawMonth = 0;
  totalAmountWithdrawYear = 0;
}

export class TransactionOrderQueryStatistic {
  totalAmountDeposit = 0;
  totalAmountWithdraw = 0;
}

// SELECT  sum(amount) as total
// FROM transactions a
// WHERE DATE(TO_TIMESTAMP(cast(a."createdAt" as bigint))) = CURRENT_DATE - INTERVAL '1 day'
// union all
//
// SELECT  sum(amount) as total
// FROM transactions a
// WHERE DATE(TO_TIMESTAMP(cast(a."createdAt" as bigint))) = CURRENT_DATE
// union all
//
// SELECT   sum(amount) as total
// FROM transactions a
// WHERE EXTRACT(WEEK FROM TO_TIMESTAMP(cast(a."createdAt" as bigint))) = EXTRACT(WEEK FROM CURRENT_DATE)
// union all
//
// SELECT  sum(amount) as total
// FROM transactions a
// WHERE DATE_PART('month', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('month', CURRENT_DATE)
// AND DATE_PART('year', TO_TIMESTAMP(cast(a."createdAt" as bigint))) = DATE_PART('year', CURRENT_DATE);
