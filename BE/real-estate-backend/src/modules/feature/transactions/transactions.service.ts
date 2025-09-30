import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schema/transactions.schema';
import { CreateTransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  // Create a new transaction record
  async create(data: CreateTransactionDto): Promise<Transaction> {
    const createdTransaction = new this.transactionModel(data);
    return createdTransaction.save();
  }

  // Get all transactions
  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec();
  }

  // transactions.service.ts
  // mock fields added for demonstration purposes
  async getTransactionsWithUsers() {
    return this.transactionModel
      .find()
      .populate([
        {
          path: 'fromAddress',
          model: 'User',
          localField: 'fromAddress',
          foreignField: 'walletAddress',
          select: 'name walletAddress',
        },
        {
          path: 'toAddress',
          model: 'User',
          localField: 'toAddress',
          foreignField: 'walletAddress',
          select: 'name walletAddress',
        },
      ])
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
      .exec();
  }
  // Get a specific transaction by transactionId
  async findOne(transactionId: string): Promise<Transaction | null> {
    return this.transactionModel.findOne({ transactionId }).exec();
  }

  // Get all transactions related to a particular property
  async findByPropertyId(propertyId: string): Promise<Transaction[]> {
    return this.transactionModel.find({ propertyId }).exec();
  }

  async findByUser(walletAddress: string): Promise<Transaction[]> {
    return this.transactionModel
      .find({
        fromAddress: { $regex: new RegExp(`^${walletAddress}$`, 'i') },
      })
      .exec();
  }
}
