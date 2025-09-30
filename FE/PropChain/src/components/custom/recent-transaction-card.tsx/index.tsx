import { formatEther } from 'ethers';
import React from 'react';

interface RecentTransactionProps {
  property: string;
  price: string;
  createdAt: string;
  toAddress?: {
    name?: string;
    walletAddress?: string;
  };
  fromAddress?: {
    name?: string;
    walletAddress?: string;
  };
}

export const RecentTransactionItem = ({
  property,
  price,
  createdAt,
  toAddress,
  fromAddress,
}: RecentTransactionProps) => {
  // Format price from wei to ETH
  const formattedPrice = parseFloat(formatEther(price)).toFixed(2);

  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const shortenAddress = (address?: string) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getDisplayAddress = (addressInfo?: {
    name?: string;
    walletAddress?: string;
  }) => {
    if (!addressInfo) return shortenAddress();
    return addressInfo?.name || shortenAddress(addressInfo.walletAddress);
  };

  return (
    <>
      <div className='text-sm row-span-1 text-gray-800'>{property}</div>
      <div className='text-sm  row-span-1 text-gray-800'>
        {formattedPrice} ETH
      </div>
      <div className='text-sm  row-span-1 text-gray-800'>{formattedDate}</div>
    </>
  );
};
