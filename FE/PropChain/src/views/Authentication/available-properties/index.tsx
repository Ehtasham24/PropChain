// 'use client';
// import React from 'react';
// import { useState, useEffect } from 'react';
// import PropertyCard from '../../../components/custom/property-card';
// import { ethers } from 'ethers';

// interface Property {
//   _id: string;
//   propertyId: string;
//   location: string;
//   price: string;
//   createdAt: string;
// }

// const AvailablePropertyView = () => {
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         const response = await fetch(
//           'http://localhost:8000/v1/api/properties/property/active',
//         );
//         if (!response.ok) throw new Error('Failed to fetch properties');
//         const data = await response.json();
//         setProperties(data);
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : 'Failed to fetch properties',
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, []);

//   const formatWeiToUSD = (weiValue: string) => {
//     try {
//       const etherValue = parseFloat(ethers.formatEther(weiValue));
//       return `${(etherValue * 3000).toLocaleString()}`; // Assuming 1 ETH = $3000
//     } catch {
//       return '$0';
//     }
//   };

//   if (loading) {
//     return (
//       <div className='max-w-6xl mx-auto px-4 py-8'>Loading properties...</div>
//     );
//   }

//   if (error) {
//     return (
//       <div className='max-w-6xl mx-auto px-4 py-8 text-red-500'>
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className='max-w-6xl mx-auto px-4 py-8'>
//       <div className='flex justify-between items-center mb-6'>
//         <h1 className='text-3xl font-bold'>Listed Properties</h1>
//       </div>

//       <div className='mb-8'>
//         {properties.map(property => (
//           <PropertyCard
//             key={property._id}
//             property={{
//               name: property.propertyId,
//               address: property.location,
//               price: property.price,
//               image: '', // You can add image handling if available
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AvailablePropertyView;

// 'use client';
// import React, { useState, useEffect } from 'react';
// import PropertyCard from '../../../components/custom/property-card';
// import { ethers } from 'ethers';
// import { WalletAddressContext } from '@/context/set-wallet-address.context';
// import { useContext } from 'react';
// import PropertyOwnershipHistoryComp from '@/components/custom/property-owner';
// // Conversion rate (consider fetching this from an API in production)
// const ETH_TO_USD_RATE = 3000;

// interface Property {
//   _id: string;
//   propertyId: string;
//   location: string;
//   price: string;
//   createdAt: string;
// }

// const property = {
//   name: 'Coastal Villa',
//   address: '123 Ocean Drive, Malibu',
//   ownershipHistory: [
//     {
//       name: 'Alex Johnson',
//       walletAddress: '0x1A2B3C4D5E6F7G8H9I',
//       isCurrentOwner: true,
//     },
//     { name: 'Sarah Thompson', walletAddress: '0x9I8H7G6F5E4D3C2B1A' },
//     { name: 'Michael Rodriguez', walletAddress: '0xABCDEF123456789XYZ' },
//   ],
// };

// const AvailablePropertyView = () => {
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [WalletAddress, setWalletAddress] = useState('');
//   const walletAddress = useContext(WalletAddressContext);
//   const [modalOpen, setModalOpen] = useState(false);

//   const closeModal = () => {
//     setModalOpen(false);
//   };

//   function handleClick() {
//     setModalOpen(true);
//   }

//   useEffect(() => {
//     const abortController = new AbortController();
//     const storedWallet = localStorage.getItem('walletAddress');
//     setWalletAddress(storedWallet ?? '');

//     const fetchProperties = async () => {
//       try {
//         if (!walletAddress) {
//           throw new Error('Wallet address not available');
//         }
//         console.log(`walllettt here---->`, storedWallet);

//         const response = await fetch(
//           `http://localhost:8000/v1/user/${storedWallet}/browse/properties`,
//           {
//             signal: abortController.signal,
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           },
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         // Check if allProps exists and is an array
//         if (!data.allProps || !Array.isArray(data.allProps)) {
//           throw new Error('Invalid response format');
//         }

//         setProperties(data.allProps);
//         setError(null);
//       } catch (err) {
//         if (!abortController.signal.aborted) {
//           setError(
//             err instanceof Error ? err.message : 'Failed to fetch properties',
//           );
//         }
//       } finally {
//         if (!abortController.signal.aborted) {
//           setLoading(false);
//         }
//       }
//     };

//     if (walletAddress) {
//       fetchProperties();
//     }

//     return () => {
//       abortController.abort();
//     };
//   }, [walletAddress]); // Add walletAddress to dependency array

//   const formatWeiToUSD = (weiValue: string) => {
//     try {
//       const ethValue = parseFloat(ethers.formatEther(weiValue));
//       return `$${(ethValue * ETH_TO_USD_RATE).toLocaleString(undefined, {
//         maximumFractionDigits: 2,
//       })}`;
//     } catch {
//       return '$0';
//     }
//   };

//   if (loading) {
//     return (
//       <div className='max-w-6xl mx-auto px-4 py-8'>
//         <div className='text-center'>Loading properties...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className='max-w-6xl mx-auto px-4 py-8'>
//         <div className='text-red-500 text-center'>Error: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className='max-w-6xl mx-auto px-4 py-8'>
//           {modalOpen && (
//         <div className='fixed inset-0 bg-black opacity-50 z-10'></div>
//       )}
//       <div className={`relative ${modalOpen ? 'opacity-50' : 'opacity-100'}`}>
//       <div className='flex justify-between items-center mb-6'>
//         <h1 className='text-3xl font-bold'>Listed Properties</h1>
//       </div>

//       <div className='mb-8'>
//         {properties.length === 0 ? (
//           <div className='text-center'>No properties available</div>
//         ) : (
//           properties.map(property => (
//             <button
//             onClick={handleClick}
//             className='block w-full'
//           >
//             <PropertyCard
//               key={property._id}
//               property={{
//                 name: property.propertyId,
//                 address: property.location,
//                 priceUSD: formatWeiToUSD(property.price),
//                 priceWei: property.price,
//                 image: '',
//                 propertyId: property.propertyId,
//               }}
//             />
//             </button>
//           ))
//         )}
//       </div>
//       </div>

//       {/* Modal */}
//       {modalOpen  && (
//         <div className='fixed inset-0 flex items-center justify-center z-20'>
//           <PropertyOwnershipHistoryComp
//             closeModal={closeModal}
//             property={property}
//           />
//         </div>
//       )}

//     </div>
//   );
// };

// export default AvailablePropertyView;
'use client';
import React, { useState, useEffect, useContext } from 'react';
import PropertyCard from '../../../components/custom/property-card';
import { ethers } from 'ethers';
import { WalletAddressContext } from '@/context/set-wallet-address.context';
import PropertyOwnershipHistoryComp from '@/components/custom/property-owner';

// Conversion rate (consider fetching this from an API in production)
const ETH_TO_USD_RATE = 3000;

interface Property {
  _id: string;
  propertyId: string;
  location: string;
  price: string;
  createdAt: string;
  ownerAddress: string;
  ownershipHistory: string[];
  isActive: boolean;
  updatedAt: string;
 
}

interface Owner {
  walletAddress: string;
}

const AvailablePropertyView = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [WalletAddress, setWalletAddress] = useState('');
  const walletAddress = useContext(WalletAddressContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProperty(null);
  };

  function handleClick(property: Property) {
    setSelectedProperty(property);
    setModalOpen(true);
  }

  useEffect(() => {
    const abortController = new AbortController();
    const storedWallet = localStorage.getItem('walletAddress');
    setWalletAddress(storedWallet ?? '');

    const fetchProperties = async () => {
      try {
        if (!walletAddress) {
          throw new Error('Wallet address not available');
        }
        console.log(`walllettt here---->`, storedWallet);

        const response = await fetch(
          `http://localhost:8000/v1/user/${storedWallet}/browse/properties`,
          {
            signal: abortController.signal,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if allProps exists and is an array
        if (!data.allProps || !Array.isArray(data.allProps)) {
          throw new Error('Invalid response format');
        }

        setProperties(data.allProps);
        setError(null);
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch properties',
          );
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (walletAddress) {
      fetchProperties();
    }

    return () => {
      abortController.abort();
    };
  }, [walletAddress]); // Add walletAddress to dependency array

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

  if (loading) {
    return (
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <div className='text-center'>Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <div className='text-red-500 text-center'>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      {modalOpen && (
        <div className='fixed inset-0 bg-black opacity-50 z-10'></div>
      )}
      <div className={`relative ${modalOpen ? 'opacity-50' : 'opacity-100'}`}>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>Listed Properties</h1>
        </div>

        <div className='mb-8'>
          {properties.length === 0 ? (
            <div className='text-center'>No properties available</div>
          ) : (
            properties.map(property => (
              <button
                key={property._id}
                onClick={() => handleClick(property)}
                className='block w-full'
              >
                <PropertyCard
                  property={{
                    name: property.propertyId,
                    address: property.location,
                    priceUSD: formatWeiToUSD(property.price),
                    priceWei: property.price,
                    image: '',
                    propertyId: property.propertyId,
                    
                  }}
                  
                />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedProperty && (
        <div className='fixed inset-0 flex items-center justify-center z-20'>
          <PropertyOwnershipHistoryComp
            closeModal={closeModal}
            address={selectedProperty.location}
            ownershipHistory={selectedProperty.ownershipHistory.map(
              address => ({
                walletAddress: address,
              }),
            )}
          />
        </div>
      )}
    </div>
  );
};

export default AvailablePropertyView;
