import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './order.schema';
import { Model } from 'mongoose';
import { OrderPayload } from './order.payload';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private OrderModel: Model<OrderDocument>) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderPayload> {
    const createdOrder = new this.OrderModel(createOrderDto);
    const order = await createdOrder.save();
    return order;
  }

  async findOrder(id: string): Promise<OrderPayload> {
    const order = await this.OrderModel.findOne({ _id: id }).exec();

    if (!order) {
      throw new NotFoundException(`order with id:${id} not found `);
    }
    return order;
  }

  async listOrder(): Promise<OrderPayload[]> {
    const Orders = await this.OrderModel.find();
    return Orders;
  }

  async updateOrder(id: string, createOrderDto: CreateOrderDto): Promise<OrderPayload> {
    await this.OrderModel.updateOne({ _id: id }, createOrderDto);
    const updatedOrder = this.OrderModel.findById(id);
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    await this.OrderModel.deleteOne({ _id: id });
  }
}