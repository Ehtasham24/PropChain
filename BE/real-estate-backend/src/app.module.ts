import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomConfigModule } from './config/config.module';
import { AuthModule } from './modules/core/auth/auth.module';
import { ContractModule } from './modules/feature/contract/contract.module';
import { PropertiesModule } from './modules/feature/properties/properties.module';
import { TransactionsModule } from './modules/feature/transactions/transactions.module';
import { EventListenerModule } from './utils/eventListener/eventListener.module';

@Module({
  imports: [
    CustomConfigModule,
    MongooseModule.forRoot(process.env.MONGO_CONNECTION || '', {
      onConnectionCreate(connection) {
        connection.on('connected', () => {
          console.log('MongoDB connected');
        });
        connection.on('disconnected', () => {
          console.log('MongoDB disconnected');
        });
        connection.on('error', (error) => {
          console.log('MongoDB connection error: ' + error);
        });
      },
    }),
    AuthModule,
    ContractModule,
    PropertiesModule,
    TransactionsModule,
    EventListenerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
