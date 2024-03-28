import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument, OrderStatus } from './order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<OrderDocument>,
  ) {}
  
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.OrderModel({
      ...createOrderDto,
      status: OrderStatus.CREATED,
    });
    
    const order = await createdOrder.save();
   
    return order;
  }

  async findOrder(id: string): Promise<Order> {
    const order = await this.OrderModel.findOne({ _id: id }).exec();

    if (!order) {
      throw new NotFoundException(`order with id:${id} not found `);
    }
    return order;
  }

  async listOrder(): Promise<Order[]> {
    const Orders = await this.OrderModel.find();
    return Orders;
  }

  async updateOrder(
    id: string,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    await this.OrderModel.updateOne({ _id: id }, createOrderDto);
    const updatedOrder = this.OrderModel.findById(id);
    return updatedOrder;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.OrderModel.findById(orderId);
    console.log('order', orderId);

    order.status = status;
    return await order.save();
  }

  async deleteOrder(id: string): Promise<void> {
    await this.OrderModel.deleteOne({ _id: id });
  }
}
