import { BrowserProvider, Contract } from 'ethers';
import DubaiRealEstateMarket from './contract/DubaiRealEstateMarket.json';

export const getContractInstance = async () => {
  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) throw new Error('Contract address not configured');
    if (!DubaiRealEstateMarket?.abi) throw new Error('ABI not loaded');

    return new Contract(contractAddress, DubaiRealEstateMarket.abi, signer);
  } catch (error) {
    console.error('Contract initialization failed:', error);
    throw error;
  }
};
