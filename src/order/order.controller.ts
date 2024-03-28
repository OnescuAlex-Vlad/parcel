import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller({
  path: 'orders',
  version: '1',
})
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.createOrder(createOrderDto);
    return {
      message: 'Order created successfully',
      order: {
        id: order._id,
        status: order.status,
        price: order.price,
      },
    };
  }

  @Post('/status')
  async updateOrderStatus(@Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.orderService.updateOrderStatus(
      updateOrderStatusDto.id,
      updateOrderStatusDto.status,
    );
    return { message: 'Order status updated successfully', order };
  }

  @Get('/list')
  listOrder() {
    return this.orderService.listOrder();
  }

  @Get('/:id')
  findOrder(@Param('id') id: string) {
    return this.orderService.findOrder(id);
  }

  @Put('/:id')
  updateOrder(@Param('id') id: string, @Body() body: CreateOrderDto) {
    return this.orderService.updateOrder(id, body);
  }

  @Delete('/:id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }
}
