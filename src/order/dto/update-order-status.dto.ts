import { IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../order.schema';

export class UpdateOrderStatusDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  status: OrderStatus;
}
