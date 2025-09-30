import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';

@Module({
  providers: [ContractService],
  exports: [ContractService], // Export to be used in EventListenerService
})
export class ContractModule {}
