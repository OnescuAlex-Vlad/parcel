import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderService } from './order.service'
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
        id: order.id,
        status: order.status,
        price: order.price,
      },
    };
  }

  @Post(':id/status')
  async updateOrderStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    try {
      const order = await this.orderService.updateOrderStatus(id, updateOrderStatusDto);
      return { message: 'Order status updated successfully', order };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Order not found');
    }
  }

  @Get('/list')
  listOrder() {
    return this.orderService.listOrder()
  }

  @Get('/:id')
  findOrder(@Param('id') id: string) {
    return this.orderService.findOrder(id)
  }

  @Put('/:id')
  updateOrder(@Param('id') id: string, @Body() body: CreateOrderDto) {
    return this.orderService.updateOrder(id, body)
  }

  @Delete('/:id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id)
  }
}