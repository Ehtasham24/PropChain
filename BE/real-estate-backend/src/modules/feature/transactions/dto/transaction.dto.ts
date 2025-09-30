import { IsString, IsNotEmpty } from 'class-validator';
import { string } from 'joi';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @IsString()
  @IsNotEmpty()
  buyerAddress: string;

  @IsString()
  @IsNotEmpty()
  fromAddress: string;

  @IsString()
  @IsNotEmpty()
  toAddress: string;

  @IsString()
  @IsNotEmpty()
  sellerAddress: string;

  @IsString()
  @IsNotEmpty()
  price: string; // Ether value as string

  @IsString()
  @IsNotEmpty()
  date: string; // Date in ISO format or any string representation

  @IsString()
  @IsNotEmpty()
  txHash?: string;
}
