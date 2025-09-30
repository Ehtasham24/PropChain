// 'use client';

// import ButtonComponent from '@/components/custom/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

// const NewListingView = () => {
//   return (
//     <div className='flex justify-center mt-12 min-h-[80%]'>
//       <div className='border-4 border-r-2 flex flex-col w-[80%]'>
//         <h1 className='w-full font-bold text-3xl h-16 text-center mt-16'>
//           Add new Property
//         </h1>

//         <div className='flex flex-col ml-48'>
//           <form>
//             {/* <div className='mb-10'>
//               <div>
//                 <Label className='text-lg mb-2'>Property Name</Label>
//               </div>

//               <Input
//                 type='text'
//                 name='property_name'
//                 id='property_name'
//                 required
//                 placeholder='Property Name'
//                 className='h-[50px] w-[80%]'
//               />
//             </div> */}

//             <div className='mb-10'>
//               <div>
//                 <Label className='text-lg mb-2'>Property Address</Label>
//               </div>

//               <Input
//                 type='text'
//                 name='property_address'
//                 id='property_address'
//                 required
//                 placeholder='Full Address'
//                 className='h-[50px] w-[80%]'
//               />
//             </div>

//             <div className='mb-10'>
//               <div>
//                 <Label className='text-lg mb-2'>Price</Label>
//               </div>

//               <Input
//                 type='text'
//                 name='price'
//                 id='price'
//                 required
//                 placeholder='Price'
//                 className='h-[50px] w-[80%]'
//               />
//             </div>

//             {/* <div className='mb-10'>
//               <div>
//                 <Label className='text-lg mb-2'>Description</Label>
//               </div>

//               <Input
//                 type='text'
//                 name='name'
//                 id='name'
//                 required
//                 placeholder='Enter property description'
//                 className='h-[200px] w-[80%]'
//               />
//             </div> */}

//             <div className='text-end pr-16 '>
//               <ButtonComponent
//                 variant='primary'
//                 size='lg'
//                 type='submit'
//                 className='w-[20%]'
//                 // disabled={isPending}
//                 // className={`relative ${isPending ? 'overflow-hidden' : ''}`}
//               >
//                 <span className='text-[18px]'>Sign up</span>
//               </ButtonComponent>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewListingView;

// 'use client';

// import ButtonComponent from '@/components/custom/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import {
//   initializeEthers,
//   connectWallet,
//   getContract,
//   listProperty,
// } from '../../../services/blockChain.handlerFunctions';
// import contractABI from '../../../utils/contract/DubaiRealEstateMarket.json';
// import { toast } from 'react-hot-toast';

// const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// const NewListingView = () => {
//   const [formData, setFormData] = useState({
//     propertyId: '',
//     location: '',
//     price: '',
//   });
//   const [account, setAccount] = useState<string>('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
//   const [contract, setContract] = useState<ethers.Contract | null>(null);
//   const [contractAddress, setContractAddress] = useState<string>('');
//   // useEffect(() => {
//   //   const savedAddress = localStorage.getItem('ganacheWalletAddress');
//   //   if (savedAddress) {
//   //     setContractAddress(savedAddress);
//   //   }
//   // }, []);

//   // Initialize provider only if MetaMask is installed
//   useEffect(() => {
//     const initializeBlockchain = async () => {
//       try {
//         if (typeof window === 'undefined' || !window.ethereum) {
//           throw new Error('Please install MetaMask');
//         }

//         if (!CONTRACT_ADDRESS) {
//           throw new Error('Contract address not configured in .env');
//         }

//         // Initialize provider
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         setProvider(provider);

//         // Get signer
//         const signer = await provider.getSigner();

//         // Initialize contract
//         const contract = new ethers.Contract(
//           CONTRACT_ADDRESS,
//           contractABI.abi, // Make sure your ABI is properly formatted
//           signer,
//         );

//         setContract(contract);
//       } catch (error) {
//         console.error('Initialization error:', error);
//       }
//     };

//     initializeBlockchain();
//   }, []);
//   // Initialize provider on component mount
//   useState(() => {
//     try {
//       const ethersProvider = initializeEthers();
//       setProvider(ethersProvider);
//     } catch (error) {
//       console.error('Provider initialization failed:', error);
//     }
//   });

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Handle wallet connection
//   const handleConnectWallet = async () => {
//     if (!provider) {
//       toast.error('Blockchain provider not initialized');
//       return;
//     }

//     try {
//       const address = await connectWallet(provider);
//       setAccount(address);

//       // Initialize contract with signer
//       const signer = await provider.getSigner();
//       if (!CONTRACT_ADDRESS) {
//         throw new Error('Contract address not configured');
//       }
//       const contractInstance = getContract(
//         signer,
//         CONTRACT_ADDRESS,
//         contractABI.abi,
//       );
//       setContract(contractInstance);
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : 'Wallet connection failed',
//       );
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!contractAddress) {
//       toast.error('Contract address not found. Please deploy contract first.');
//       return;
//     }

//     if (!contract) {
//       toast.error('Contract not initialized');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await listProperty(contract, {
//         propertyId: formData.propertyId,
//         price: parseFloat(formData.price),
//         location: formData.location,
//       });
//       toast.success('Property listed successfully!');
//       setFormData({ propertyId: '', location: '', price: '' });
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Listing failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <div className='flex justify-center mt-12 min-h-[80%]'>
//       <div className='border-4 border-r-2 flex flex-col w-[80%]'>
//         <h1 className='w-full font-bold text-3xl h-16 text-center mt-16'>
//           Add new Property
//         </h1>

//         <div className='flex flex-col ml-48'>
//           <form onSubmit={handleSubmit}>
//             {/* Wallet Connection */}
//             <div className='mb-6 text-right pr-16'>
//               {!account ? (
//                 <ButtonComponent
//                   variant='outline'
//                   onClick={handleConnectWallet}
//                   type='button'
//                 >
//                   Connect Wallet
//                 </ButtonComponent>
//               ) : (
//                 <p className='text-sm text-gray-600'>
//                   Connected: {account.slice(0, 6)}...{account.slice(-4)}
//                 </p>
//               )}
//             </div>

//             {/* Property ID */}
//             <div className='mb-10'>
//               <Label className='text-lg mb-2'>Property ID</Label>
//               <Input
//                 type='text'
//                 name='propertyId'
//                 value={formData.propertyId}
//                 onChange={handleInputChange}
//                 required
//                 placeholder='Unique Property ID'
//                 className='h-[50px] w-[80%]'
//               />
//             </div>

//             {/* Property Address */}
//             <div className='mb-10'>
//               <Label className='text-lg mb-2'>Property Address</Label>
//               <Input
//                 type='text'
//                 name='location'
//                 value={formData.location}
//                 onChange={handleInputChange}
//                 required
//                 placeholder='Full Address'
//                 className='h-[50px] w-[80%]'
//               />
//             </div>

//             {/* Price */}
//             <div className='mb-10'>
//               <Label className='text-lg mb-2'>Price (ETH)</Label>
//               <Input
//                 type='number'
//                 name='price'
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 required
//                 placeholder='Price in ETH'
//                 className='h-[50px] w-[80%]'
//                 step='0.01'
//               />
//             </div>

//             {/* Submit Button */}
//             <div className='text-end pr-16'>
//               <ButtonComponent
//                 variant='primary'
//                 size='lg'
//                 type='submit'
//                 className='w-[20%]'
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Processing...' : 'List Property'}
//               </ButtonComponent>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewListingView;

'use client';

import ButtonComponent from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getContractInstance } from '../../../utils/contract.utils';
import { listProperty } from '../../../services/blockChain.handlerFunctions';
import { useWalletAddress } from '../../../context/set-wallet-address.context';

const NewListingView = () => {
  const [formData, setFormData] = useState({
    propertyId: '',
    location: '',
    price: '',
  });
  const [account, setAccount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { walletAddress, connectWallet, isConnected } = useWalletAddress();

  useEffect(() => {
    const generatePropertyId = () => {
      const timestamp = Date.now();
      return `prop-${timestamp}`;
    };

    setFormData(prev => ({
      ...prev,
      propertyId: generatePropertyId(),
    }));
  }, []);

  // Handle wallet connection and contract initialization
  const handleSubmit = async (e: React.FormEvent) => {
    console.log(`here`);
    e.preventDefault();
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    console.log(`walletAddress: ${walletAddress}`);
    console.log(`wallet from metaMask:${window.ethereum.selectedAddress}`);
    console.log('Form data:', formData);
    if (parseFloat(formData.price) < 0) {
      toast.error('Price cannot be negative');
      return;
    }

    if (walletAddress !== window.ethereum.selectedAddress) {
      toast.error('Owner onlist must be the same as the wallet connected');
      return;
    }

    setIsLoading(true);
    try {
      const contract = await getContractInstance();
      await listProperty(contract, {
        propertyId: formData.propertyId,
        price: parseFloat(formData.price),
        location: formData.location,
        wallet:walletAddress
      });

      toast.success('Property listed successfully!');

      // Generate new ID after successful submission
      const newId = `prop-${Date.now()}`;
      setFormData({
        propertyId: newId,
        location: '',
        price: '',
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }; // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className='flex justify-center mt-12 min-h-[80%]'>
      <div className='border-4 border-r-2 flex flex-col w-[80%]'>
        <h1 className='w-full font-bold text-3xl h-16 text-center mt-16'>
          Add new Property
        </h1>

        <div className='flex flex-col ml-48'>
          <div className='mb-6 text-right pr-16'>
            {!isConnected ? (
              <ButtonComponent
                variant='outline'
                onClick={connectWallet}
                type='button'
              >
                Connect Wallet
              </ButtonComponent>
            ) : (
              <p className='text-sm text-gray-600'>
                Connected: {walletAddress.slice(0, 6)}...
                {walletAddress.slice(-4)}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Wallet Connection */}
            <div className='mb-6 text-right pr-16'>
              {!walletAddress ? (
                <ButtonComponent
                  variant='outline'
                  onClick={connectWallet}
                  type='button'
                >
                  Connect Wallet
                </ButtonComponent>
              ) : (
                <p className='text-sm text-gray-600'>
                  Connected: {walletAddress.slice(0, 6)}...
                  {walletAddress.slice(-4)}
                </p>
              )}
            </div>

            {/* Property ID */}
            <div className='mb-10'>
              <Label className='text-lg mb-2'>Property ID</Label>
              <Input
                type='text'
                name='propertyId'
                value={formData.propertyId}
                onChange={handleInputChange}
                required
                placeholder='Unique Property ID'
                className='h-[50px] w-[80%] bg-gray-100'
                readOnly
              />
              <p className='text-sm text-gray-500 mt-1'>
                Auto-generated property ID
              </p>
            </div>

            {/* Property Address */}
            <div className='mb-10'>
              <Label className='text-lg mb-2'>Property Address</Label>
              <Input
                type='text'
                name='location'
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder='Full Address'
                className='h-[50px] w-[80%]'
              />
            </div>

            {/* Price */}
            <div className='mb-10'>
              <Label className='text-lg mb-2'>Price (ETH)</Label>
              <Input
                type='number'
                name='price'
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder='Price in ETH'
                className='h-[50px] w-[80%]'
                step='0.01'
              />
            </div>

            {/* Submit Button */}
            <div className='text-end pr-16'>
              <ButtonComponent
                variant='primary'
                size='lg'
                type='submit'
                className='w-[20%]'
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'List Property'}
              </ButtonComponent>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewListingView;
