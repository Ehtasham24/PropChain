'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCookieFn } from '@/utils/storage.util';
import { jwtDecode } from 'jwt-decode';

const SellerSideBar = [
  { label: 'Dashboard', path: '/home' },
  { label: 'Add Property', path: '/new-listing' },
  { label: 'Purchased', path: '/purchased-properties' },
  { label: 'Sold', path: '/sold-properties' },
  { label: 'Profile', path: '/profile' },
  { label: 'Properties', path: '/available-properties' },
];

interface JWT {
  id: number;
  email: string;
  walletAddress: string;
}

const SideBar = () => {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    walletAddress: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getCookieFn('accessToken'); // Fetch token

        console.log('token', token);
        if (!token) return;

        const user = jwtDecode<JWT>(token);
        // console.log('token', user.walletAddress);

        console.log('user', user);

        const response = await fetch(
          `http://localhost:8000/v1/user/${user.walletAddress}`,
          {
            method: 'GET',
          },
        );
        console.log('response', response);

        if (!response.ok) throw new Error('Failed to fetch user');

        const userData = await response.json();
        console.log('userData', userData);
        console.log('userData.name', userData.users[0].name);
        const walletAddress1 = userData.users[0].walletAddress;
        const formattedAddress =
          walletAddress1.substring(0, 8) +
          '...' +
          walletAddress1.substring(walletAddress1.length - 4);
        console.log('formattedAddress', formattedAddress);
        setUser({
          name: userData.users[0].name,
          walletAddress: formattedAddress,
          email: userData.users[0].email,
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    console.log('Fetching user data...');
    fetchUserData();
  }, []);

  const initials = user?.name
    ?.split(' ')
    .map(word => word.substring(0, 1))
    .join('');
  // console.log(userData);
  console.log('user', user);
  console.log(`user?.name`, user?.name);
  console.log('initials', initials);
  return (
    <>
      <div className='flex h-screen bg-gray-50'>
        <div className='w-64 bg-lightBlue text-white'>
          <div className='p-6'>
            <h1 className='text-xl font-bold text-black'>PropChain</h1>
            <p className='text-sm bg-lightBlue text-black mt-2'>
              Blockchain Property Marketplace
            </p>
          </div>

          <nav className='mt-6'>
            {SellerSideBar.map(item => (
              <Link
                key={item.label}
                href={item.path}
                className={`flex items-center px-6 py-3 ${
                  item.label === 'Dashboard'
                    ? 'bg-lightBlue bg-opacity-50'
                    : 'hover:bg-opacity-30'
                }`}
              >
                <div className='w-3 h-3 bg-lightBlue rounded-full mr-3'></div>
                <span className='text-black font-light text-lg'>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className='absolute bottom-0 p-6 flex items-center'>
            <div className='w-10 h-10 bg-blue-300 text-black rounded-full text-center pt-2'>
              {initials?.toUpperCase()}
            </div>{' '}
            <div className='ml-3'>
              <p className='font-medium text-black'>
                {user?.name.toUpperCase()}
              </p>
              <p className='text-xs text-black'>{user?.walletAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
