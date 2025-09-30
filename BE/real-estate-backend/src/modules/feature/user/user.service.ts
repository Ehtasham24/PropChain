import { BadRequestException, Injectable } from '@nestjs/common';
import { UserSignupDTO } from './dto/user-signup-.dto';
import { hashPassword } from 'src/utils/hashing/bcrypt';
import { User, UserDocument } from './schema/user.schema';
import {
  Property,
  PropertyDocument,
} from '../properties/schema/properties.schema';
import {
  Transaction,
  TransactionDocument,
} from '../transactions/schema/transactions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
import { Role } from 'src/types/common.type';
// import { Transaction } from 'ethers';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    @InjectModel(Transaction.name)
    private TransactionModel: Model<TransactionDocument>,
  ) {}

  async getUsersInfo(walletAddress: string) {
    try {
      const users = await this.userModel
        .find({ walletAddress: walletAddress })
        .exec();
      return {
        users,
      };
    } catch (err) {
      console.log('ERROR IN [user service] in get users info method', err);
      throw new BadRequestException(err.message);
    }
  }

  //================================================  CREATE USER METHOD   ===================================================================================

  async createUser(userSignupDto: UserSignupDTO) {
    try {
      const hashedPassword = hashPassword(userSignupDto.password);

      const userInstance = new this.userModel({
        ...userSignupDto,
        password: hashedPassword,
      });

      const userCreated = await userInstance.save();

      const { password, ...userWithoutPassword } = userCreated.toObject();

      return {
        message: 'User created successfully',
        user: userWithoutPassword,
      };
    } catch (err) {
      console.log('ERROR IN [user service] in create user method', err);
      throw new BadRequestException(err.message);
    }
  }

  async getUserTransactions(walletAddress: string) {
    try {
      const user = await this.TransactionModel.find({
        toAddress: walletAddress,
      }).exec();
      return {
        msg: `User transactions with wallet address ${walletAddress}-->`,
        user,
      };
    } catch (err) {
      console.log(
        'ERROR IN [user service] in get user transactions method',
        err,
      );
      throw new BadRequestException(err.message);
    }
  }

  async getUserProperties(walletAddress: string) {
    try {
      const userProps = await this.propertyModel
        .find({
          ownerAddress: {
            $regex: '^' + walletAddress + '$',
            $options: 'i',
          },
        })
        .exec();

      return {
        msg: `Properties for wallet address ${walletAddress}:`,
        userProps,
      };
    } catch (err) {
      console.log('ERROR IN [user service] in getUserProperties:', err);
      throw new BadRequestException(err.message);
    }
  }

  async browseProperties(walletAddress: string) {
    try {
      // Normalize the input address to lowercase
      const normalizedAddress = walletAddress.toLowerCase();

      const allProps = await this.propertyModel
        .find({
          isActive: true,
          ownerAddress: {
            $not: {
              $regex: new RegExp(`^${normalizedAddress}$`, 'i'),
            },
          },
        })
        .exec();

      return {
        msg: `Active properties not owned by ${walletAddress}`,
        allProps,
      };
    } catch (err) {
      console.log('ERROR IN [user service] browseProperties:', err);
      throw new BadRequestException(err.message);
    }
  }
  async getSpentTransactions(walletAddress: string) {
    try {
      // Use a regex for case-insensitive match for the user query as well
      const user = await this.userModel
        .findOne({
          walletAddress: { $regex: new RegExp(`^${walletAddress}$`, 'i') },
        })
        .lean();

      let aggregationPipeline: any[] = [
        {
          $match: {
            // Use a regex to perform case-insensitive matching for fromAddress
            fromAddress: { $regex: new RegExp(`^${walletAddress}$`, 'i') },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: {
              $sum: {
                $convert: { input: '$price', to: 'double' },
              },
            },
            count: { $sum: 1 },
          },
        },
      ];

      const result = await this.TransactionModel.aggregate(aggregationPipeline);

      const defaultResponse = {
        totalAmount: 0,
        transactionCount: 0,
        message: `No transactions found for ${walletAddress}`,
      };

      const finalResult =
        result.length > 0
          ? {
              totalAmount: result[0].totalAmount,
              transactionCount: result[0].count,
              message: `Total amount spent for ${walletAddress}: ${result[0].totalAmount}`,
            }
          : defaultResponse;

      return finalResult;
    } catch (err) {
      console.error('Error in getSpentTransactions:', err);
      throw new BadRequestException(err.message);
    }
  }

  public async deleteAllusers():Promise<DeleteResult>{
    try{
    return await this.userModel.deleteMany().exec();
    }catch(err){
      throw new Error (`Error in deleting users ${err.messages}`)
  }
}
}
