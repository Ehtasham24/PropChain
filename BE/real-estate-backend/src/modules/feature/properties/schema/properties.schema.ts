import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PropertyDocument = Property & Document;

@Schema({ timestamps: true })
export class Property {
  @Prop({ required: true, unique: true })
  propertyId: string;

  @Prop({ type: String, required: true, ref: 'User' })
  ownerAddress: string; // Current owner wallet address

  @Prop({ required: true })
  price: string; // Stored as string to match on-chain representation (Ether or Wei)

  @Prop({ required: true })
  location: string;

  @Prop({ default: true })
  isActive: boolean; // Whether it's available for sale

  @Prop({ type: [String], default: [] })
  ownershipHistory: string[]; // Array of wallet addresses
}

export const PropertySchema = SchemaFactory.createForClass(Property);
