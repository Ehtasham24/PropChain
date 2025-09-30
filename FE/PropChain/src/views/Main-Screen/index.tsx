'use client';

import RoleCard from '@/components/custom/role-card';
import React from 'react';

const MainScreenView = () => {
  const sellerDescription = [
    'List properties',
    'Manage listings',
    'Track offers',
    'Complete sales',
  ];

  const buyerDescription = [
    'Browse properties',
    'Make secure offers',
    'Track transactions',
    'Verify ownership',
  ];

  const sellerIcon = (
    <svg
      width='40'
      height='40'
      viewBox='0 0 60 60'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M15,25 L15,50 L45,50 L45,25 L30,10 Z'
        stroke='#4F46E5'
        strokeWidth='2'
        fill='white'
      />
      <rect
        x='25'
        y='35'
        width='10'
        height='15'
        fill='#4F46E5'
      />
      <rect
        x='35'
        y='20'
        width='15'
        height='10'
        fill='#4F46E5'
      />
      <path
        d='M42.5,20 L42.5,15'
        stroke='#4F46E5'
        strokeWidth='2'
      />
    </svg>
  );

  const buyerIcon = (
    <svg
      width='40'
      height='40'
      viewBox='0 0 60 60'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle
        cx='30'
        cy='25'
        r='10'
        stroke='#10B981'
        strokeWidth='2'
        fill='white'
      />
      <path
        d='M15,60 C15,45 45,45 45,60'
        stroke='#10B981'
        strokeWidth='2'
        fill='none'
      />
    </svg>
  );

  return (
    <div className='bg-gradient-to-br from-blue-100 to-blue-50 min-h-screen relative overflow-hidden'>
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center mb-12'>
          <h1 className='font-bold text-3xl text-gray-800 mb-3'>
            Welcome to PropChain
          </h1>
          <p className='text-gray-500'>
            Select your role to get started on our secure blockchain property
            platform
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto'>
          <RoleCard
            title='Seller'
            icon={sellerIcon}
            description={sellerDescription}
            buttonText='Continue as Seller'
            bgColor='bg-indigo-600'
            iconColor='indigo'
            role='seller'
          />
          <RoleCard
            title='Buyer'
            icon={buyerIcon}
            description={buyerDescription}
            buttonText='Continue as Buyer'
            bgColor='bg-emerald-500'
            iconColor='emerald'
            role='buyer'
          />
        </div>
      </div>
    </div>
  );
};

export default MainScreenView;
