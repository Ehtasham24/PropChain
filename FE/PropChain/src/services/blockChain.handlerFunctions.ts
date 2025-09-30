// src/services/blockchainService.js
import { ethers } from 'ethers';
import type { BigNumberish } from 'ethers';
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const connectWallet = async (provider: ethers.BrowserProvider) => {
  try {
    const signer = await provider.getSigner();
    return signer.address;
    // const address = await signer.getAddress();
    // return address;
  } catch (error: any) {
    throw new Error(`Wallet connection failed: ${error.message}`);
  }
};

// export const connectWallet = async (provider: ethers.BrowserProvider) => {
//   try {
//     const signer = await provider.getSigner();
//     // In ethers v6, use getAddress() to obtain the address.
//     const address = await signer.getAddress();
//     return address;
//   } catch (error: any) {
//     throw new Error(`Wallet connection failed: ${error.message}`);
//   }
// };


export const getContract = (
  signer: ethers.Signer,
  address: string,
  abi: any,
): ethers.Contract => {
  if (!address) throw new Error('Contract address is required');
  if (!abi) throw new Error('Contract ABI is required');
  return new ethers.Contract(address, abi, signer);
};

// export const getContract = (
//   signer: ethers.Signer,
//   address: string,
//   abi: any,
// ): ethers.Contract => {
//   if (!address) throw new Error('Contract address is required');
//   if (!abi) throw new Error('Contract ABI is required');
//   return new ethers.Contract(address, abi, signer);
// };


export const initializeEthers = (): ethers.BrowserProvider => {
  if (typeof window === 'undefined') {
    throw new Error('Window object not available');
  }

  if (!window.ethereum) {
    throw new Error('MetaMask extension not detected');
  }

  return new ethers.BrowserProvider(window.ethereum);
};

// export const listProperty = async (
//   contract: ethers.Contract,
//   propertyData: { propertyId: string; price: number; location: string },
// ) => {
//   console.log(`list property invoked`);
//   try {
//     const priceInWei = ethers.parseEther(propertyData.price.toString());
//     const tx = await contract.listProperty(
//       propertyData.propertyId,
//       priceInWei,
//       propertyData.location,
//     );
//     await tx.wait();
//     return tx;
//   } catch (error: any) {
//     throw new Error(`Listing failed: ${error.message}`);
//   }
// };

//ENS bypassed
export const listProperty = async (
  contract: ethers.Contract,
  propertyData: { propertyId: string; price: number; location: string, wallet:string },
) => {
  // const wallet=initializeEthers();
  console.log(`wallet here-->`,propertyData.wallet);
  console.log('list property invoked');
  console.log(ethers.isAddress(propertyData.wallet));
  try {
    const priceInWei = ethers.parseEther(propertyData.price.toString());
    console.log(ethers.isAddress);
    console.log(`property loc here`,propertyData.location);

    // Ensure the location is a standard Ethereum address
    if (ethers.isAddress(propertyData.wallet)) {
      console.log(`here inside iff`);
      const tx = await contract.listProperty(
        propertyData.propertyId,
        priceInWei,
        propertyData.location,
      );
      await tx.wait();
      return tx;
    } else {
      throw new Error('Invalid Ethereum address provided for location.');
    }
  } catch (error: any) {
    console.log(`----->`,error);
    throw new Error(`Listing failed: ${error.message}`);
  }
};


// export const listProperty = async (
//   contract: ethers.Contract,
//   propertyData: { propertyId: string; price: number; location: string },
// ) => {
//   console.log('list property invoked');
//   try {
//     const priceInWei = ethers.parseEther(propertyData.price.toString());

//     // Check the network to see if ENS is supported
//     const network = await contract.provider.getNetwork();
//     if (network.chainId === 1337) {
//       console.log('Local network detected: ENS resolution is not supported on this network.');
//       // Optionally, you can bypass or adjust any ENS-dependent logic here.
//     }

//     const tx = await contract.listProperty(
//       propertyData.propertyId,
//       priceInWei,
//       propertyData.location,
//     );
//     await tx.wait();
//     return tx;
//   } catch (error: any) {
//     if (error.message.includes('does not support ENS')) {
//       throw new Error(
//         `Listing failed due to ENS resolution issue on a local network. If you're testing locally, disable ENS calls. Original error: ${error.message}`
//       );
//     }
//     throw new Error(`Listing failed: ${error.message}`);
//   }
// };


export const activateListing = async (
  contract: ethers.Contract,
  propertyId: string,
) => {
  try {
    console.log('Activating property:', propertyId);
    const tx = await contract.activateListing(propertyId);
    await tx.wait();
    return tx;
  } catch (error: any) {
    throw new Error(`Activation failed: ${error.message}`);
  }
};

export const deactivateListing = async (
  contract: ethers.Contract,
  propertyId: string,
) => {
  try {
    const tx = await contract.deactivateListing(propertyId);
    await tx.wait();
    return tx;
  } catch (error: any) {
    throw new Error(`Deactivation failed: ${error.message}`);
  }
};

// export const buyProperty = async (
//   contract: ethers.Contract,
//   buyData: { propertyId: string; price: number },
// ) => {
//   try {
//     const priceInWei = ethers.parseEther(buyData.price.toString());
//     const tx = await contract.buyProperty(buyData.propertyId, {
//       value: priceInWei,
//     });
//     await tx.wait();
//     return tx;
//   } catch (error: any) {
//     throw new Error(`Purchase failed: ${error.message}`);
//   }
// };

// export const buyProperty = async (
//   contract: ethers.Contract,
//   buyData: { propertyId: string; priceWei: string },
// ) => {
//   try {
//     const tx = await contract.buyProperty(buyData.propertyId, {
//       value: buyData.priceWei, // Use wei directly
//     });
//     await tx.wait();
//     return tx;
//   } catch (error: any) {
//     throw new Error(`Purchase failed: ${error.message}`);
//   }
// };

// Updated blockChain.handlerFunctions.ts
export const buyProperty = async (
  contract: ethers.Contract,
  buyData: { propertyId: string; priceWei: string },
) => {
  try {
    // Convert priceWei string to BigNumber
    const value = BigInt(buyData.priceWei);
    const tx = await contract.buyProperty(buyData.propertyId, {
      value: value,
      gasLimit: 500000, // Add explicit gas limit to prevent estimation failures
    });

    const receipt = await tx.wait();
    return receipt;
  } catch (error: any) {
    // Parse custom error message
    let errorMessage = 'Purchase failed';
    if (error.data?.message) {
      errorMessage = error.data.message;
    } else if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Handle common revert reasons
    if (errorMessage.includes('Property is not active')) {
      errorMessage = 'This property is no longer available';
    } else if (errorMessage.includes('Incorrect payment amount')) {
      errorMessage = `Incorrect payment - required ${ethers.formatEther(buyData.priceWei)} ETH`;
    }

    throw new Error(errorMessage);
  }
};

export const updatePropertyPrice = async (
  contract: ethers.Contract,
  priceData: { propertyId: string; newPrice: number },
) => {
  try {
    console.log('Updating price:', priceData.newPrice);
    const newPriceInWei = ethers.parseEther(priceData.newPrice.toString());
    const tx = await contract.updatePropertyPrice(
      priceData.propertyId,
      newPriceInWei,
      { gasLimit: 300000 },
    );
    await tx.wait();
    return tx;
  } catch (error: any) {
    throw new Error(`Price update failed: ${error.message}`);
  }
};

export const getOwnershipHistory = async (
  contract: ethers.Contract,
  propertyId: string,
) => {
  try {
    return await contract.getOwnershipHistory(propertyId);
  } catch (error: any) {
    throw new Error(`History fetch failed: ${error.message}`);
  }
};

export const getPropertyDetails = async (
  contract: ethers.Contract,
  propertyId: string,
) => {
  try {
    const details = await contract.getProperty(propertyId);
    return {
      propertyId: details[0],
      owner: details[1],
      price: details[2],
      location: details[3],
      isActive: details[4],
      ownershipHistory: details[5],
    };
  } catch (error: any) {
    throw new Error(`Property details fetch failed: ${error.message}`);
  }
};

export const getAllPropertyIds = async (contract: ethers.Contract) => {
  try {
    return await contract.getAllPropertyIds();
  } catch (error: any) {
    throw new Error(`Fetching all properties failed: ${error.message}`);
  }
};
