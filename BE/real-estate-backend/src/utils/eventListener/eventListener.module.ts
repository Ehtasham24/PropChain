import { Module } from '@nestjs/common';
import { EventListenerService } from './eventListener.utils';
import { ContractModule } from '../../modules/feature/contract/contract.module';
import { PropertiesModule } from '../../modules/feature/properties/properties.module';
import { TransactionsModule } from '../../modules/feature/transactions/transactions.module';

@Module({
  imports: [ContractModule, PropertiesModule, TransactionsModule],
  providers: [EventListenerService],
})
export class EventListenerModule {}
