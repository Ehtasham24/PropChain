import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  propertyId: string;

  @Prop({
    type: String,
    required: true,
    // ref: 'User',
    // localField: 'fromAddress',
    // foreignField: 'walletAddress',
  })
  fromAddress: string;

  @Prop({
    type: String,
    required: true,
    // ref: 'User',
    // localField: 'toAddress',
    // foreignField: 'walletAddress',
  })
  toAddress: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  txHash: string; // Transaction hash
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
