import { OrderDto } from '../src/order/DTO/order.dto';
import * as moment from 'moment';
export const handleText = (order: OrderDto): string => {
  return `Mã đơn hàng: ${order.id}\nThể loại: ${order.productName}\nSố lương: ${
    order.quantity
  }\nThời gian:${moment(+order.createdDate * 1000).format(
    'DD/MM/YYYY hh:mm:ss',
  )}\n`;
};
