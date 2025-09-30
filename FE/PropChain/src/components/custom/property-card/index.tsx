// // 'use-client';
// import React, { useState } from 'react';

// interface PropertyCardProps {
//   property: {
//     name: string;
//     address: string;
//     price: string;
//     image: string;
//   };
// }

// const PropertyCard = ({ property }: PropertyCardProps) => {
//   const { name, address, price, image } = property;

//   return (
//     <div className='bg-white rounded-lg shadow-md overflow-hidden mb-4 transition-transform hover:shadow-lg hover:-translate-y-1'>
//       <div className='flex flex-col md:flex-row'>
//         <div className='w-full md:w-2/3 p-4 flex flex-col justify-between'>
//           <div>
//             <h3 className='text-xl font-bold text-gray-800 mb-1'>{address}</h3>
//           </div>
//           <div className='flex items-center justify-between mt-3'>
//             <span className='text-blue-600 font-bold text-lg'>${price}</span>
//             <button className='bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full font-medium transition-colors'>
//               Buy Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyCard;

// PropertyCard.tsx
'use client';

import React from 'react';
import { buyProperty } from '../../../services/blockChain.handlerFunctions';
import { getContractInstance } from '../../../utils/contract.utils';
import { WalletAddressContext } from '@/context/set-wallet-address.context';
import { ethers } from 'ethers';
import { Signer } from 'ethers';
import { toast } from 'react-hot-toast';
import { useState,useEffect } from 'react';
import { useContext } from 'react';

interface PropertyCardProps {
  property: {
    name: string;
    address: string;
    priceUSD: string; // USD formatted price
    priceWei: string; // Original wei value from API
    image: string;
    propertyId: string;
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [WalletAddress, setWalletAddress] = useState('');
  const walletAddress = useContext(WalletAddressContext);

   useEffect(() => {
      const storedWallet = localStorage.getItem('walletAddress');
      setWalletAddress(storedWallet ?? '');
      console.log(`stored walletAddress : ${storedWallet}`)
      console.log(`walletAddress while buying: ${walletAddress}`);
      console.log(`type: ${typeof(walletAddress)}`)
      console.log('heree---->',JSON.stringify(walletAddress))
   },[]);

  const { name, address, priceUSD, priceWei, image, propertyId } = property;

  const pricetobePassed = Number(priceWei);

  const handleBuy = async () => {
    const storedwallet=localStorage.getItem('walletAddress');
    console.log(storedwallet);
    try {
      const contract = await getContractInstance();
      console.log(`Contract infor---> ${JSON.stringify(contract)}`);

      let rAddress;
      if (contract.runner && 'getAddress' in contract.runner) {
        // Cast runner as Signer to be able to call getAddress()
        const runnerAddress = await (contract.runner as Signer).getAddress();
        rAddress=runnerAddress;
        console.log('Runner Address:', runnerAddress);
      } else {
        console.warn('Contract runner is null or not a signer. It might be a provider without an address.');
      }

      console.log(`runnerAddressVal---> ${rAddress}`);
      console.log(`storedAddressval---> ${storedwallet}`);
      
      if(rAddress?.toLocaleLowerCase()!=storedwallet?.toLocaleLowerCase()){

        console.log(`runnerAddressVal---> ${rAddress}`);
        console.log(`storedAddressval---> ${storedwallet}`);

        console.log('Runner Address is not the same as the wallet address');
        toast.error(`logged in address and contract runner address do not match`);
        return;
      }

      // Pass priceWei directly as string
      await buyProperty(contract, {
        propertyId,
        priceWei: property.priceWei, // Use original string value
      });

      toast.success('Purchase initiated successfully!');
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error(
        error.message || 'Purchase failed. Check console for details.',
      );
    }
  };
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden mb-4 transition-transform hover:shadow-lg hover:-translate-y-1'>
      <div className='flex flex-col md:flex-row'>
        <div className='w-full md:2/3 p-4 flex flex-col justify-between'>
          <div>
            <h3 className='text-xl font-bold text-gray-800 mb-1'>{address}</h3>
          </div>
          <div className='flex items-center justify-between mt-3'>
            <span className='text-blue-600 font-bold text-lg'>{priceUSD}</span>
            <button
              onClick={handleBuy}
              className='bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full font-medium transition-colors'
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
