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
import { Logger } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller({
  path: 'orders',
  version: '1',
})
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderService.createOrder(createOrderDto);
      this.logOrderCreationSuccess(order);
      return this.createSuccessResponse(order);
    } catch (error) {
      this.logOrderCreationFailure(error);
      return this.createErrorResponse(error);
    }
  }

  @Post('/status')
  @ApiOperation({ summary: 'Update order status by ID' })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateOrderStatus(@Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    try {
      const order = await this.orderService.updateOrderStatus(
        updateOrderStatusDto.id,
        updateOrderStatusDto.status,
      );
      this.logOrderStatusUpdateSuccess(
        updateOrderStatusDto.id,
        updateOrderStatusDto.status,
        order.status,
      );
      return this.createStatusUpdateSuccessResponse(
        updateOrderStatusDto.id,
        updateOrderStatusDto.status,
        order.status,
      );
    } catch (error) {
      this.logOrderStatusUpdateFailure(error);
      return this.createStatusUpdateErrorResponse(error);
    }
  }

  @Post('search')
  @ApiOperation({ summary: 'Search orders by dropoff address' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 200, description: 'Orders found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async searchOrderByDropoffAddress(
    @Body() searchParams: { address: string; postalCode: string },
  ) {
    try {
      const { address, postalCode } = searchParams;
      const orderIds = await this.orderService.searchOrderByDropoffAddress(
        address,
        postalCode,
      );
      this.logOrdersFound(orderIds);
      return this.createOrdersFoundResponse(orderIds);
    } catch (error) {
      this.logSearchOrdersFailure(error);
      return this.createSearchOrdersErrorResponse(error);
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

  private logOrderCreationSuccess(order: any) {
    Logger.log('Order created successfully', 'OrderController');
  }

  private logOrderCreationFailure(error: any) {
    Logger.error('Failed to create order', error, 'OrderController');
  }

  private createSuccessResponse(order: any) {
    return {
      message: 'Order created successfully',
      order: this.formatOrderResponse(order),
    };
  }

  private createErrorResponse(error: any) {
    return {
      message: 'Failed to create order',
      error: error.message,
    };
  }

  private formatOrderResponse(order: any) {
    return {
      id: order._id,
      status: order.status,
      price: order.price,
    };
  }

  private logOrderStatusUpdateSuccess(
    id: string,
    oldStatus: string,
    newStatus: string,
  ) {
    Logger.log(
      `Order status updated successfully. Order ID: ${id}, Old Status: ${oldStatus}, New Status: ${newStatus}`,
      'OrderController',
    );
  }

  private logOrderStatusUpdateFailure(error: any) {
    Logger.error('Failed to update order status', error, 'OrderController');
  }

  private createStatusUpdateSuccessResponse(
    id: string,
    oldStatus: string,
    newStatus: string,
  ) {
    return {
      message: 'Order status updated successfully',
      id: id,
      oldOrder: oldStatus,
      newStatus: newStatus,
    };
  }

  private createStatusUpdateErrorResponse(error: any) {
    return {
      message: 'Failed to update order status',
      error: error.message,
    };
  }

  private logOrdersFound(orderIds: string[]) {
    Logger.log(`Orders found: ${orderIds.join(', ')}`, 'OrderController');
  }

  private logSearchOrdersFailure(error: any) {
    Logger.error(
      'Failed to search orders by dropoff address',
      error,
      'OrderController',
    );
  }

  private createOrdersFoundResponse(orderIds: string[]) {
    return {
      message: 'Orders found',
      orderIds,
    };
  }

  private createSearchOrdersErrorResponse(error: any) {
    return {
      message: 'Failed to search orders by dropoff address',
      error: error.message,
    };
  }
}
