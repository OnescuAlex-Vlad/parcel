import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  CREATED = 'created',
  PICKED_UP = 'picked_up',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema()
export class Address {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  zipcode: string;

  @Prop({ required: true })
  phoneNumber: string;
}

@Schema()
export class Package {
  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  length: number;

  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  weight: number;
}

@Schema()
export class Order {
  @Prop()
  id: string;

  @Prop({ required: true, type: Address })
  dropoff: Address;

  @Prop({ required: true, type: Address })
  pickup: Address;

  @Prop({ required: true, type: [Package] })
  packages: Package[];

  @Prop()
  price: number;

  @Prop({ required: true })
  status: string;
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
      price += volumeIncrease * 0.5; // Add €0.50 for every 5000 increase in volume
    }

    price += weight * 0.1; // Add €0.10 for every kilogram of weight
  });

  order.price = price;

  next();
});