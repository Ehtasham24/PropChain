import { Controller, Param, Get, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { DeleteResult } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(`:WalletAddress`)
  async getUserInfo(@Param('WalletAddress') walletAddress: string) {
    return this.userService.getUsersInfo(walletAddress);
  }

  //Working
  @Get(':WalletAddress/transactions')
  async getUserTransactions(@Param('WalletAddress') walletAddress: string) {
    return this.userService.getUserTransactions(walletAddress);
  }

  //Working
  @Get(':WalletAddress/properties')
  async getUserProperties(@Param('WalletAddress') walletAddress: string) {
    return this.userService.getUserProperties(walletAddress);
  }

  //Working
  @Get(':WalletAddress/browse/properties')
  async browseProperties(@Param('WalletAddress') walletAddress: string) {
    return this.userService.browseProperties(walletAddress);
  }
  //Working
  @Get(':WalletAddress/transactions/spent')
  async getSpentTransactions(@Param('WalletAddress') walletAddress: string) {
    return this.userService.getSpentTransactions(walletAddress);
  }

  //delete all user records
  @Delete()
  async deleteAllUsers():Promise<DeleteResult>{
    return this.userService.deleteAllusers();
  }
}
