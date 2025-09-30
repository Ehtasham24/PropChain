'use client';

import React from 'react';

import { removeCookie } from '@/utils/storage.util';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const router = useRouter();

  const handleLogOut = () => {
    localStorage.removeItem('walletAddress');
    removeCookie('accessToken');
    router.push('/login');
  };

  const goToDashboard = () => {
    router.push('/home');
  };
  return (
    <header className='bg-white p-6 flex justify-between items-center border-b'>
      <button onClick={goToDashboard}>
        <h2 className='text-2xl font-semibold text-gray-800'>{title}</h2>
      </button>
      <div className='flex items-center mr-28'>
        <button
          className='w-60 h-10 flex items-center justify-center font-bold text-black mr-2'
          onClick={handleLogOut}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
