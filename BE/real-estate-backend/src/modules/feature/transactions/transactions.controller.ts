import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { CreateTransactionDto } from './dto/transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // Create a new transaction
  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  // Get all transactions
  @Get()
  async getAllTransactions() {
    return this.transactionService.findAll();
  }

  @Get('withUsers')
  async getTransactionsWithUsers() {
    return this.transactionService.getTransactionsWithUsers();
  }

  // Get a transaction by transactionId
  @Get(':transactionId')
  async getTransaction(@Param('transactionId') transactionId: string) {
    return this.transactionService.findOne(transactionId);
  }

  // Get transactions for a specific property
  @Get('property/:propertyId')
  async getTransactionsByProperty(@Param('propertyId') propertyId: string) {
    return this.transactionService.findByPropertyId(propertyId);
  }

  // Get transactions for a specific user (buyer/seller)
  @Get('user/:walletAddress')
  async getTransactionsByUser(@Param('walletAddress') walletAddress: string) {
    console.log(`walletAddress---->`, walletAddress);
    return this.transactionService.findByUser(walletAddress);
  }
}
