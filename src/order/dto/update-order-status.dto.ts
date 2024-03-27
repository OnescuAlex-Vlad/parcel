import { IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../order.schema';

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  status: OrderStatus;
}