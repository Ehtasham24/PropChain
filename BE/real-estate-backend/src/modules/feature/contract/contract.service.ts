// // import { Injectable } from '@nestjs/common';
// // import contract from '../../../../../../blockChain/build/contracts/DubaiRealEstateMarket.json'; // Assuming you have this configured properly
// // import { Contract, JsonRpcProvider } from 'ethers';
// // import abi from '../../../../../../blockChain/build/contracts/DubaiRealEstateMarket.json';

// // @Injectable()
// // export class ContractService {
// //   getContract(): Contract {
// //     // Assuming you have a provider and contract address
// //     const provider = new JsonRpcProvider('YOUR_RPC_URL');
// //     const contractAddress = 'YOUR_CONTRACT_ADDRESS';

// //     return new Contract(contractAddress, abi, provider);
// //   }
// // }

// import { Injectable } from '@nestjs/common';
// import { Contract, JsonRpcProvider } from 'ethers';
// // import contractArtifact from '../../../assets/abi/DubaiRealEstateMarket.json';
// import * as path from 'path';
// import * as fs from 'fs';

// @Injectable()
// export class ContractService {
//   private readonly contract: Contract;

//   constructor() {
//     // Initialize provider and contract instance in constructor
//     // const provider = new JsonRpcProvider(process.env.RPC_URL); // ✅ Use ENV Variable
//     // const contractAddress = process.env.CONTRACT_ADDRESS as string; // ✅ Use ENV Variable

//     // this.contract = new Contract(
//     //   contractAddress,
//     //   contractArtifact.abi,
//     //   provider,
//     // );
//     // // ✅ Note: .abi if ABI JSON has `{ abi, networks, ... }` structure

//     const abiPath = path.join(
//       __dirname,
//       '../../../assets/abi/DubaiRealEstateMarket.json',
//     );
//     const contractArtifact = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));

//     const provider = new JsonRpcProvider(process.env.RPC_URL);
//     const contractAddress = process.env.CONTRACT_ADDRESS as string;

//     this.contract = new Contract(
//       contractAddress,
//       contractArtifact.abi,
//       provider,
//     );
//   }

//   getContract(): Contract {
//     return this.contract;
//   }
// }

import { Injectable, Logger } from '@nestjs/common';
import { Contract, JsonRpcProvider } from 'ethers';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);
  private contract: Contract;
  private readonly provider: JsonRpcProvider;

  constructor() {
    // Load contract ABI
    const abiPath = path.join(
      process.cwd(), // Start from project root
      'src',
      'assets',
      'abi',
      'DubaiRealEstateMarket.json',
    );

    const contractArtifact = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));

    // Initialize provider with explicit connection check
    this.provider = new JsonRpcProvider(process.env.RPC_URL);
    this.logger.debug(
      `Attempting to connect to RPC endpoint: ${process.env.RPC_URL}`,
    );

    // Verify connection
    this.verifyRpcConnection().then(() => {
      this.logger.log(
        `✅ Successfully connected to Ganache at ${process.env.RPC_URL}`,
      );

      // Initialize contract after connection confirmation
      const contractAddress = process.env.CONTRACT_ADDRESS as string;
      if (!contractAddress) {
        throw new Error('Contract address is not defined');
      }
      this.contract = new Contract(
        contractAddress,
        contractArtifact.abi,
        this.provider,
      );
      this.logger.log(`📜 Contract initialized at address: ${contractAddress}`);
    });
  }

  private async verifyRpcConnection(): Promise<void> {
    try {
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();

      this.logger.debug(`Network chain ID: ${network.chainId}`);
      this.logger.debug(`Current block number: ${blockNumber}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to connect to RPC endpoint: ${error.message}`,
      );
      throw new Error('RPC connection failed');
    }
  }

  getContract(): Contract {
    return this.contract;
  }
}
