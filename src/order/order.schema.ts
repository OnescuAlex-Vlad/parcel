// order.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

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
  phonenumber: string;
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
  @Prop({ required: true, type: Address })
  dropoff: Address;

  @Prop({ required: true, type: Address })
  pickup: Address;

  @Prop({ required: true, type: [Package] })
  packages: Package[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
