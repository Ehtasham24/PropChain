// 'use client';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useRouter } from 'next/navigation';

// export const ProfileView = () => {
//   const router = useRouter();

//   return (
//     <div className='p-6'>
//       <h1 className='text-xl font-bold text-gray-800 mb-4'>Profile</h1>

//       <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
//         <div className='flex items-start mb-6'>
//           <div className='w-24 h-24 rounded-full bg-lightBlue flex items-center justify-center mr-6'>
//             <span className='text-white text-2xl font-semibold'>AJ</span>
//           </div>
//           <div className='flex-1'>
//             <h2 className='text-lg font-medium mb-4'>Personal Information</h2>

//             <div className='mb-4'>
//               <Label
//                 htmlFor='name'
//                 className='block text-sm text-gray-600 mb-1'
//               >
//                 Name
//               </Label>
//               <Input
//                 type='text'
//                 id='name'
//                 name='name'
//                 className='w-full p-2 border border-gray-300 rounded'
//                 defaultValue='Alex Johnson'
//                 readOnly
//               />
//             </div>

//             <div className='mb-4'>
//               <Label
//                 htmlFor='email'
//                 className='block text-sm text-gray-600 mb-1'
//               >
//                 Email
//               </Label>
//               <Input
//                 type='email'
//                 id='email'
//                 name='email'
//                 className='w-full p-2 border border-gray-300 rounded'
//                 defaultValue='alex.johnson@example.com'
//                 readOnly
//               />
//             </div>

//             <div className='mb-4'>
//               <Label
//                 htmlFor='password'
//                 className='block text-sm text-gray-600 mb-1'
//               >
//                 Password
//               </Label>
//               <Input
//                 type='password'
//                 id='password'
//                 name='password'
//                 className='w-full p-2 border border-gray-300 rounded'
//                 defaultValue='************'
//                 readOnly
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileView;

'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWalletAddress } from '../../../context/set-wallet-address.context';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
// import { Skeleton } from '../../../components/ui/skeleton';

interface UserProfile {
  _id: string;
  walletAddress: string;
  name: string;
  email: string;
  createdAt: string;
}

export const ProfileView = () => {
  // const { walletAddress } = useWalletAddress();
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    const loadWalletAddress = () => {
      const storedWallet = localStorage.getItem('walletAddress') || '';
      setWalletAddress(storedWallet);
    };

    // Initial load
    loadWalletAddress();
    // Load wallet address on component mount
  }, []);

  // Fetch user profile data
  const { data, isLoading, isError } = useQuery<UserProfile>({
    queryKey: ['userProfile', walletAddress],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8000/v1/user/${walletAddress}`,
      );
      return response.data.users[0]; // Return first user from array
    },
    enabled: !!walletAddress,
  });

  if (!isLoading && !walletAddress) {
    return (
      <div className='p-6'>
        <div className='text-gray-700 p-4 border rounded-lg bg-red-50'>
          🔗 fetching Wallet Address
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-6'>
        <div className='text-red-500 p-4 border rounded-lg bg-red-50'>
          ❌ Error loading profile data
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <h1 className='text-xl font-bold text-gray-800 mb-4'>Profile</h1>

      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
        <div className='flex items-start mb-6'>
          <div className='w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center mr-6'>
            <span className='text-white text-2xl font-semibold'>
              {data?.name?.[0] || '?'}
            </span>
          </div>
          <div className='flex-1 space-y-4'>
            <h2 className='text-lg font-medium'>Personal Information</h2>

            <div>
              <Label
                htmlFor='wallet'
                className='block text-sm text-gray-600 mb-1'
              >
                Wallet Address
              </Label>
              <Input
                id='wallet'
                className='w-full p-2 border border-gray-300 rounded font-mono'
                value={walletAddress}
                readOnly
              />
            </div>

            <div>
              <Label
                htmlFor='name'
                className='block text-sm text-gray-600 mb-1'
              >
                Name
              </Label>
              <Input
                id='name'
                className='w-full p-2 border border-gray-300 rounded'
                value={data?.name || ''}
                readOnly
              />
            </div>

            <div>
              <Label
                htmlFor='email'
                className='block text-sm text-gray-600 mb-1'
              >
                Email
              </Label>
              <Input
                id='email'
                className='w-full p-2 border border-gray-300 rounded'
                value={data?.email || ''}
                readOnly
              />
            </div>

            <div>
              <Label
                htmlFor='created'
                className='block text-sm text-gray-600 mb-1'
              >
                Account Created
              </Label>
              <Input
                id='created'
                className='w-full p-2 border border-gray-300 rounded'
                value={
                  data?.createdAt
                    ? new Date(data.createdAt).toLocaleDateString()
                    : 'Unknown'
                }
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
