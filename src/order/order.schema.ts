import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  CREATED = 'CREATED',
  PICKED_UP = 'PICKED_UP',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Schema()
export class Address {
  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop()
  zipcode: string;

  @Prop()
  phoneNumber: string;
}

@Schema()
export class Package {
  @Prop()
  height: number;

  @Prop()
  length: number;

  @Prop()
  width: number;

  @Prop()
  weight: number;
}

@Schema()
export class Order {
  _id: string;

  @Prop()
  dropoff: Address;

  @Prop()
  pickup: Address;

  @Prop()
  packages: Package[];

  @Prop()
  price: number;

  @Prop()
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre('save', function(next) {
  const order = this;
  let price = 0;

  order.packages.forEach((pkg) => {
    const volume = pkg.height * pkg.length * pkg.width;
    const weight = pkg.weight;

    price += 1; // Each package costs €1

    if (volume > 5000) {
      const volumeIncrease = Math.ceil(volume / 5000) - 1;
      console.log('Volume Increase:', volumeIncrease);
      price += volumeIncrease; 
    }

    price += weight * 0.1; // Add €0.10 for every kilogram of weight
  });

  order.price = price;
  
  next();
});