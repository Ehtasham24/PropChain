import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schema/user.schema';
import {
  Property,
  PropertySchema,
} from '../properties/schema/properties.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from '../transactions/schema/transactions.schema';
import { Transaction } from 'ethers';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
