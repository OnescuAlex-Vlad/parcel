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
    
   
    return  await createdOrder.save();
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
    try {
      await this.OrderModel.updateOne({ _id: id }, createOrderDto);
    } catch (error) {
      throw new NotFoundException(`order with id:${id} not found `);
    }
    const updatedOrder = this.OrderModel.findById(id);
    return updatedOrder;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.OrderModel.findById(orderId);


    let nextState;
    switch (status) {
      case OrderStatus.CREATED:
        nextState = 'PICKED_UP';
        break;
      case OrderStatus.PICKED_UP:
        nextState = 'DELIVERED';
        break;
      case OrderStatus.DELIVERED:
        nextState = 'RETURNED';
        break;
      default:
        throw new Error('Invalid state transition');
    }

    order.status = nextState;
    return await order.save();
  }

  async searchOrderByDropoffAddress(address: string, postalCode: string): Promise<string[]> {
    const orders = await this.OrderModel.find({
      'dropoff.address': { $regex: address, $options: 'i' }, // Case-insensitive partial match
      'dropoff.zipcode': postalCode, // Full match for postal code
    });
    return orders.map((order) => order.id);
  }

  async deleteOrder(id: string): Promise<void> {
    await this.OrderModel.deleteOne({ _id: id });
  }
}
