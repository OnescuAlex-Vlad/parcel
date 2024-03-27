import { PartialType } from '@nestjs/swagger'
import { Order } from './order.schema'

export class OrderPayload extends PartialType(Order) {
  createdA?: string
  updateAt?: string
}