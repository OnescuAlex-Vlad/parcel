import {
  Body,
  Controller,
  Delete,
  Get,
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
    try {
      const order = await this.orderService.createOrder(createOrderDto);
      return {
        message: 'Order created successfully',
        order: {
          id: order._id,
          status: order.status,
          price: order.price,
        },
      };
    } catch (error) {
      return {
        message: 'Failed to create order',
        error: error.message,
      };
    }
  }

  @Post('/status')
  async updateOrderStatus(@Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    try {
      const order = await this.orderService.updateOrderStatus(
        updateOrderStatusDto.id,
        updateOrderStatusDto.status,
      );

      return {
        message: 'Order status updated successfully',
        id: updateOrderStatusDto.id,
        oldOrder: updateOrderStatusDto.status,
        newStatus: order.status,
      };
    } catch (error) {
      return {
        message: 'Failed to update order status',
        error: error.message,
      };
    }
  }

  @Post('search')
  /**
   * Searches for orders by dropoff address.
   *
   * @param searchParams - The search parameters containing the address and postal code.
   * @returns An object with a message and an array of order IDs.
   */
  async searchOrderByDropoffAddress(
    @Body() searchParams: { address: string; postalCode: string },
  ) {
    try {
      const { address, postalCode } = searchParams;
      const orderIds = await this.orderService.searchOrderByDropoffAddress(
        address,
        postalCode,
      );
      return {
        message: 'Orders found',
        orderIds,
      };
    } catch (error) {
      return {
        message: 'Failed to search orders by dropoff address',
        error: error.message,
      };
    }
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
