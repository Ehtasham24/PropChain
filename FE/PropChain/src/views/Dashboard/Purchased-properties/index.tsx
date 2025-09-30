// 'use client';
// import DynamicPropertyTable from '@/components/custom/properties-table';
// import { usePurchasedProperties } from '../../../services/react-query-client/auth/properties.hooks';
// import { useWalletAddress } from '../../../context/set-wallet-address.context';
// import {
//   activateListing,
//   updatePropertyPrice,
// } from '../../../services/blockChain.handlerFunctions';
// import Swal from 'sweetalert2';

// // import { BrowserProvider, Contract } from 'ethers';
// // import DubaiRealEstateMarket from '../../../utils/contract/DubaiRealEstateMarket.json';
// import { toast } from 'react-hot-toast';
// import { getContractInstance } from '../../../utils/contract.utils';

// const PurchasedPropertiesView = () => {
//   const { walletAddress } = useWalletAddress();
//   const {
//     data: apiResponse,
//     isLoading,
//     isError,
//     error,
//   } = usePurchasedProperties(walletAddress);

//   // Transform API response to the format expected by DynamicPropertyTable
//   const transformedData =
//     apiResponse?.userProps?.map((prop: any) => ({
//       property: prop.propertyId || 'Unknown',
//       isActive: prop.isActive,
//       ownerAddress: prop.ownerAddress || 'Unknown',
//       address: prop.location || 'Unknown',
//       purchasePrice: formatWeiToUSD(prop.price),
//       purchaseDate: new Date(prop.createdAt).toLocaleDateString('en-US', {
//         month: 'short',
//         day: '2-digit',
//         year: 'numeric',
//       }),
//     })) || [];
//   console.log('transformedData--->', transformedData);

//   const handlePriceUpdate = async (propertyId: string) => {
//     try {
//       const { value: newPrice } = await Swal.fire({
//         title: 'Enter new price',
//         input: 'text',
//         inputLabel: 'New Price',
//         inputPlaceholder: 'Enter new price here...',
//         showCancelButton: true,
//       });
//       if (!newPrice) return;

//       const contract = await getContractInstance();
//       const tx = await updatePropertyPrice(contract, {
//         propertyId,
//         newPrice: parseFloat(newPrice),
//       });

//       toast.promise(tx.wait(), {
//         loading: 'Updating price...',
//         success: () => `${propertyId} price updated!`,
//         error: err => `Update failed: ${err.message}`,
//       });

//       await tx.wait();
//       toast.success('Price updated!');
//     } catch (error: any) {
//       const contract = await getContractInstance();
//       const decodedError = error.data
//         ? contract.interface.parseError(error.data)
//         : null;
//       toast.error(decodedError?.args[0] || 'Price update failed');
//     }
//   };

//   const handleActivate = async (propertyId: string, ownerAddress: string) => {
//     console.log('propertyId--->', propertyId);
//     console.log('walletAddress--->', walletAddress);
//     console.log('transformedData.ownerAddress--->', ownerAddress);
//     try {
//       if (walletAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
//         toast.error('Only owner can activate the property');
//         return;
//       }

//       if (!walletAddress) {
//         toast.error('Please connect your wallet first');
//         return;
//       }

//       // const contract = await getContractInstance();

//       const contract = (await getContractInstance()) as any;

//       const tx = await activateListing(contract, propertyId);

//       toast.promise(tx.wait(), {
//         loading: 'Activating property...',
//         success: () => `${propertyId} activated!`,
//         error: err => `Activation failed: ${err.message}`,
//       });

//       await tx.wait();
//     } catch (error: any) {
//       console.log('Error activating property:', error);

//       try {
//         const contract = await getContractInstance();
//         // Check if error.data is available before parsing
//         if (error.data) {
//           const decodedError = contract.interface.parseError(error.data);
//           console.log(`error.data--->`, error.data);
//           console.log('decodedError:', decodedError);
//           toast.error(decodedError?.args[0] || 'Activation failed');
//         } else {
//           console.log(`error`, error);
//           toast.error('error', error);
//         }
//       } catch (parseError) {
//         toast.error('Activation failed: Unable to parse error');
//       }
//     }
//   };

//   function formatWeiToUSD(weiValue: string) {
//     try {
//       // Convert from Wei to Ether (assuming 18 decimals)
//       const etherValue = parseFloat(weiValue) / 1e18;
//       // Format to USD (assuming 1 ETH = $3000 - you may want to use a real exchange rate)
//       return `$${(etherValue * 3000).toLocaleString()}`;
//     } catch {
//       return '$0';
//     }
//   }

//   const boughtColumns = [
//     { key: 'property', header: 'Property' },
//     { key: 'address', header: 'Address' },
//     {
//       key: 'purchasePrice',
//       header: 'Price',
//       className: 'text-blue-600 font-medium',
//     },
//     { key: 'purchaseDate', header: 'Purchase Date' },
//   ];

//   const boughtStats = [
//     {
//       label: 'Total Properties',
//       value: transformedData.length.toString(),
//     },
//     {
//       label: 'Total Investment',
//       value:
//         transformedData.length > 0
//           ? transformedData
//               .reduce((acc: number, curr: { purchasePrice: string }) => {
//                 const price = parseFloat(
//                   curr.purchasePrice.replace(/[^0-9.]/g, ''),
//                 );
//                 return acc + price;
//               }, 0)
//               .toLocaleString('en-US', {
//                 style: 'currency',
//                 currency: 'USD',
//               })
//           : '$0',
//     },
//     {
//       label: 'Avg. Property Value',
//       value:
//         transformedData.length > 0
//           ? (
//               transformedData.reduce(
//                 (acc: number, curr: { purchasePrice: string }) => {
//                   const price = parseFloat(
//                     curr.purchasePrice.replace(/[^0-9.]/g, ''),
//                   );
//                   return acc + price;
//                 },
//                 0,
//               ) / transformedData.length
//             ).toLocaleString('en-US', {
//               style: 'currency',
//               currency: 'USD',
//             })
//           : '$0',
//     },
//   ];

//   if (!walletAddress) {
//     return (
//       <div className='p-4 text-red-500'>
//         🔗 Connect your wallet to view purchased properties
//       </div>
//     );
//   }

//   if (isLoading) {
//     return <div className='p-4'>⏳ Loading properties...</div>;
//   }

//   if (isError) {
//     console.error('Error loading properties:', error);
//     return (
//       <div className='p-4 text-red-500'>
//         ❌ Error loading properties: {error.message}
//       </div>
//     );
//   }

//   if (!transformedData.length) {
//     return (
//       <div className='p-4 text-gray-500'>
//         🏠 No properties found for this wallet
//       </div>
//     );
//   }

//   return (
//     <DynamicPropertyTable
//       title='My  Properties'
//       viewType='buyer'
//       stats={boughtStats}
//       columns={boughtColumns}
//       data={transformedData}
//       onActivate={handleActivate}
//       onUpdatePrice={handlePriceUpdate}
//       walletAddress={walletAddress}
//     />
//   );
// };

// export default PurchasedPropertiesView;

'use client';
import { useEffect, useState } from 'react';
import DynamicPropertyTable from '@/components/custom/properties-table';
import { usePurchasedProperties } from '../../../services/react-query-client/auth/properties.hooks';
import {
  activateListing,
  updatePropertyPrice,
} from '../../../services/blockChain.handlerFunctions';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { getContractInstance } from '../../../utils/contract.utils';
import { ethers } from 'ethers';

const ETH_TO_USD_RATE = 3000; // Consider fetching this dynamically

const PurchasedPropertiesView = () => {
  const [localWalletAddress, setLocalWalletAddress] = useState('');
  const [metaMask, setMetaMask] = useState('');
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = usePurchasedProperties(localWalletAddress);

  // Load wallet address from localStorage on mount and setup refresh
  useEffect(() => {
    const getWalletAddress = async () => {
      if (window.ethereum) {
        try {
          // Request account access
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });

          // Log the first account address
          console.log('MetaMask Wallet Address:', accounts[0]);
          setMetaMask(accounts[0]);
        } catch (error) {
          console.error('Error accessing MetaMask:', error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };

    getWalletAddress();

    const loadWalletAddress = () => {
      const storedWallet = localStorage.getItem('walletAddress') || '';
      setLocalWalletAddress(storedWallet);
    };

    // Initial load
    loadWalletAddress();

    // Add storage event listener for cross-tab updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'walletAddress') {
        loadWalletAddress();
        refetch();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refetch]);

  // Price formatting
  // Removed duplicate declaration of formatWeiToUSD

  const formatWeiToUSD = (weiValue: string) => {
    try {
      const ethValue = parseFloat(ethers.formatEther(weiValue));
      return `$${(ethValue * ETH_TO_USD_RATE).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`;
    } catch {
      return '$0';
    }
  };

  // Transform API response
  const transformedData =
    apiResponse?.userProps?.map((prop: any) => ({
      property: prop.propertyId || 'Unknown',
      isActive: prop.isActive,
      ownerAddress: prop.ownerAddress || 'Unknown',
      address: prop.location || 'Unknown',
      purchasePrice: formatWeiToUSD(prop.price),
      purchaseDate: new Date(prop.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    })) || [];

  // Price update handler
  const handlePriceUpdate = async (propertyId: string) => {
    try {
      const { value: newPrice } = await Swal.fire({
        title: 'Enter new price',
        input: 'text',
        inputLabel: 'New Price (ETH)',
        inputPlaceholder: 'Enter new price in ETH...',
        showCancelButton: true,
        inputValidator: value => {
          if (!value || isNaN(Number(value))) {
            return 'Please enter a valid number!';
          }
        },
      });

      if (!newPrice) return;

      const contract = await getContractInstance();
      const tx = await updatePropertyPrice(contract, {
        propertyId,
        newPrice: parseFloat(newPrice),
      });

      await toast.promise(tx.wait(), {
        loading: 'Updating price...',
        success: `${propertyId} price updated!`,
        error: err => `Update failed: ${err.message}`,
      });

      refetch();
    } catch (error: any) {
      console.error('Price update error:', error);
      toast.error(error.reason || 'Price update failed');
    }
  };

  // Activation handler
  const handleActivate = async (propertyId: string, ownerAddress: string) => {
    try {
      if (!localWalletAddress) {
        toast.error('Wallet address not available');
        return;
      }
      console.log(`Wallet connected rn`, metaMask);
      // console.log(`transformedData`, transformedData);
      console.log(`localWalletAddress:`, localWalletAddress);
      // console.log(`ownerAddress:`, transformedData.ownerAddress);

      if (localWalletAddress.toLowerCase() !== metaMask.toLowerCase()) {
        toast.error('Only property owner can activate listing');
        return;
      }

      const contract = await getContractInstance();
      const tx = await activateListing(contract, propertyId);

      await toast.promise(tx.wait(), {
        loading: 'Activating property...',
        success: `${propertyId} activated!`,
        error: err => `Activation failed: ${err.message}`,
      });

      refetch();
    } catch (error: any) {
      console.error('Activation error:', error);
      toast.error(error.reason || 'Activation failed');
    }
  };

  // Table configuration
  const boughtColumns = [
    { key: 'property', header: 'Property' },
    { key: 'address', header: 'Address' },
    {
      key: 'purchasePrice',
      header: 'Price',
      className: 'text-blue-600 font-medium',
    },
    { key: 'purchaseDate', header: 'Purchase Date' },
  ];

  const boughtStats = [
    {
      label: 'Total Properties',
      value: transformedData.length.toString(),
    },
    {
      label: 'Total Investment',
      value: transformedData
        .reduce(
          (acc: number, curr: { purchasePrice: string }) =>
            acc + parseFloat(curr.purchasePrice.replace(/[^0-9.]/g, '')),
          0,
        )
        .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    },
    {
      label: 'Avg. Property Value',
      value:
        transformedData.length > 0
          ? (
              transformedData.reduce(
                (acc: number, curr: { purchasePrice: string }) =>
                  acc + parseFloat(curr.purchasePrice.replace(/[^0-9.]/g, '')),
                0,
              ) / transformedData.length
            ).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
          : '$0',
    },
  ];

  // Render states
  if (!localWalletAddress) {
    return (
      <div className='p-4 text-red-500'>
        🔗 Connect your wallet to view purchased properties
      </div>
    );
  }

  if (isLoading) {
    return <div className='p-4'>⏳ Loading properties...</div>;
  }

  if (isError) {
    return (
      <div className='p-4 text-red-500'>
        ❌ Error loading properties: {error?.message || 'Unknown error'}
      </div>
    );
  }

  if (!transformedData.length) {
    return (
      <div className='p-4 text-gray-500'>
        🏠 No properties found for this wallet
      </div>
    );
  }

  return (
    <DynamicPropertyTable
      title='My Properties'
      viewType='buyer'
      stats={boughtStats}
      columns={boughtColumns}
      data={transformedData}
      onActivate={handleActivate}
      onUpdatePrice={handlePriceUpdate}
      metaMask={metaMask}
    />
  );
};

export default PurchasedPropertiesView;
