// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { ContractService } from '../../modules/feature/contract/contract.service';
// import { PropertyService } from '../../modules/feature/properties/properties.service';
// import { TransactionService } from '../../modules/feature/transactions/transactions.service';

// @Injectable()
// export class EventListenerService implements OnModuleInit {
//   constructor(
//     private readonly contractService: ContractService,
//     private readonly propertyService: PropertyService,
//     private readonly transactionService: TransactionService,
//   ) {}

//   onModuleInit() {
//     const contract = this.contractService.getContract();

//     contract.on(
//       'PropertyListed',
//       async (propertyId, price, location, owner) => {
//         console.log('📢 PropertyListed:', {
//           propertyId,
//           price,
//           location,
//           owner,
//         });
//         await this.propertyService.upsertProperty({
//           propertyId,
//           ownerAddress: owner,
//           price: price.toString(),
//           location,
//           ownershipHistory: [owner],
//           isActive: false,
//         });
//       },
//     );

//     contract.on('PropertyActivated', async (propertyId) => {
//       console.log('📢 PropertyActivated:', { propertyId });
//       await this.propertyService.updateStatus(propertyId, true);
//     });

//     contract.on('PropertyDeactivated', async (propertyId) => {
//       console.log('📢 PropertyDeactivated:', { propertyId });
//       await this.propertyService.updateStatus(propertyId, false);
//     });

//     contract.on(
//       'OwnershipTransferred',
//       async (propertyId, previousOwner, newOwner) => {
//         console.log('📢 OwnershipTransferred:', {
//           propertyId,
//           previousOwner,
//           newOwner,
//         });
//         await this.propertyService.transferOwnership(propertyId, newOwner);

//         await this.transactionService.create({
//           transactionId: `txn_${Date.now()}`,
//           propertyId,
//           fromAddress: previousOwner,
//           toAddress: newOwner,
//           price: '0',
//           buyerAddress: newOwner,
//           sellerAddress: previousOwner,
//           date: new Date().toISOString(),
//         });
//       },
//     );

//     contract.on('PropertySold', async (propertyId, newOwner) => {
//       console.log('📢 PropertySold:', { propertyId, newOwner });
//       await this.propertyService.transferOwnership(propertyId, newOwner);
//     });
//   }
// }

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ContractService } from '../../modules/feature/contract/contract.service';
import { PropertyService } from '../../modules/feature/properties/properties.service';
import { TransactionService } from '../../modules/feature/transactions/transactions.service';

@Injectable()
export class EventListenerService implements OnModuleInit {
  constructor(
    private readonly contractService: ContractService,
    private readonly propertyService: PropertyService,
    private readonly transactionService: TransactionService,
  ) {}

  onModuleInit() {
    const contract = this.contractService.getContract();

    // Listen for PropertyListed event
    contract.on(
      'PropertyListed',
      async (propertyId, price, location, owner) => {
        console.log('📢 PropertyListed:', {
          propertyId,
          price,
          location,
          owner,
        });
        await this.propertyService.upsertProperty({
          propertyId,
          ownerAddress: owner,
          price: price.toString(),
          location,
          ownershipHistory: [owner],
          isActive: false,
        });
      },
    );

    // Listen for PropertyActivated event
    contract.on('PropertyActivated', async (propertyId) => {
      console.log('📢 PropertyActivated:', { propertyId });
      await this.propertyService.updateStatus(propertyId, true);
    });

    // Listen for PropertyDeactivated event
    contract.on('PropertyDeactivated', async (propertyId) => {
      console.log('📢 PropertyDeactivated:', { propertyId });
      await this.propertyService.updateStatus(propertyId, false);
    });

    // Listen for OwnershipTransferred event (includes price)
    contract.on(
      'OwnershipTransferred',
      async (propertyId, price, previousOwner, newOwner, event) => {
        console.log('📢 OwnershipTransferred:', {
          propertyId,
          price,
          previousOwner,
          newOwner,
        });
        // Update property: transfer ownership, mark as sold, and update ownership history.
        await this.propertyService.transferOwnership(propertyId, newOwner);
        console.log('Event object:', event);
        console.log(`transaction Hash : ${event.log}`);
        const txHash = event.log?.transactionHash || 'N/A';
        console.log('hash is here-----> ', txHash);

        const createDto = {
          transactionId: `txn_${Date.now()}`,
          propertyId,
          buyerAddress: newOwner,
          fromAddress: previousOwner,
          toAddress: newOwner,
          sellerAddress: previousOwner,
          price: price.toString(),
          date: new Date().toISOString(),
          txHash,
        };
        // Create a transaction record with the price (converted to string) and transaction hash.
        await this.transactionService.create(createDto);
        console.log(`✅ Transaction recorded for property ${propertyId}`);
      },
    );

    // Listen for PropertySold event (optional, if emitted separately)
    contract.on('PropertySold', async (propertyId, newOwner) => {
      console.log('📢 PropertySold:', { propertyId, newOwner });
      await this.propertyService.transferOwnership(propertyId, newOwner);
      console.log(`✅ Property marked as sold: ${propertyId}`);
    });
    contract.on('PriceUpdated', async (propertyId, newPrice) => {
      console.log('📢 PriceUpdated:', {
        propertyId,
        newPrice: newPrice.toString(),
      });

      try {
        await this.propertyService.updatePrice(propertyId, newPrice.toString());
        console.log(`✅ Price updated for property ${propertyId}`);
      } catch (error) {
        console.error(`❌ Error updating price for ${propertyId}:`, error);
      }
    });
  }
}
