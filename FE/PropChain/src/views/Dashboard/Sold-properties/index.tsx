// 'use client';

// import DynamicPropertyTable from '@/components/custom/properties-table';
// import { SoldPropertyData } from '@/types/types/common.types';

// const SoldPropertiesView = () => {
//   const soldData: SoldPropertyData[] = [
//     {
//       property: 'Coastal Villa',
//       address: '123 Ocean Drive, Malibu',
//       salePrice: '$850K',
//       saleDate: 'Mar 10, 2025',
//       buyer: 'J. Smith',
//     },
//     {
//       property: 'Lake House',
//       address: '456 Lakeview Road, Geneva',
//       salePrice: '$780K',
//       saleDate: 'Mar 01, 2025',
//       buyer: 'R. Johnson',
//     },
//     {
//       property: 'Downtown Apt',
//       address: '789 Main St, New York',
//       salePrice: '$420K',
//       saleDate: 'Feb 15, 2025',
//       buyer: 'M. Davis',
//     },
//     {
//       property: 'Suburban Home',
//       address: '321 Oak Street, Chicago',
//       salePrice: '$520K',
//       saleDate: 'Feb 02, 2025',
//       buyer: 'L. Wilson',
//     },
//   ];

//   const soldColumns = [
//     { key: 'property', header: 'Property' },
//     { key: 'address', header: 'Address' },
//     {
//       key: 'salePrice',
//       header: 'Sale Price',
//       className: 'text-blue-600 font-medium',
//     },
//     { key: 'saleDate', header: 'Sale Date' },
//     { key: 'buyer', header: 'Buyer' },
//   ];

//   const soldStats = [
//     { label: 'Total Sold', value: '4' },
//     { label: 'Total Revenue', value: '$2.57M' },
//     { label: 'Avg. Sale Price', value: '$642.5K' },
//   ];

//   return (
//     <DynamicPropertyTable
//       title='My Sold Properties'
//       viewType='Seller'
//       stats={soldStats}
//       columns={soldColumns}
//       data={soldData}
//     />
//   );
// };

// export default SoldPropertiesView;

'use client';

import DynamicPropertyTable from '@/components/custom/properties-table';
import { SoldPropertyData } from '@/types/types/common.types';
import { useContext, useEffect, useState } from 'react';
import { WalletAddressContext } from '@/context/set-wallet-address.context';
import { ethers } from 'ethers';
import { Stats } from 'fs';

// Conversion rate (consider fetching from API)
const ETH_TO_USD_RATE = 3000;

interface Transaction {
  _id: string;
  propertyId: string;
  fromAddress: string;
  toAddress: string;
  price: string;
  createdAt: string;
}

interface TransactionStats {
  totalAmount: string;
  transactionCount: number;
}

const SoldPropertiesView = () => {
  // const walletAddress = useContext(WalletAddressContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const loadWalletAddress = () => {
      const storedWallet = localStorage.getItem('walletAddress') || '';
      setWalletAddress(storedWallet);
    };
    loadWalletAddress();
    const fetchData = async () => {
      try {
        if (!walletAddress) {
          throw new Error('Wallet address not available');
        }

        // transactions
        const transactionsRes = await fetch(
          `http://localhost:8000/v1/transactions/user/${walletAddress}`,
        );
        if (!transactionsRes.ok)
          throw new Error('Failed to fetch transactions');
        const transactionsData = await transactionsRes.json();

        const statsRes = await fetch(
          `http://localhost:8000/v1/user/${walletAddress}/transactions/spent`,
        );
        if (!statsRes.ok) throw new Error('Failed to fetch stats');
        const statsData = await statsRes.json();

        setTransactions(transactionsData);
        setStats(statsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [walletAddress]);

  const formatWeiToUSD = (wei: string) => {
    try {
      const eth = parseFloat(ethers.formatEther(wei));
      console.log(`eth--->`, eth);
      const valve = `$${(eth * ETH_TO_USD_RATE).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`;
      console.log(`valve--->`, valve);
      return valve;
    } catch {
      return '$0';
    }
  };

  const soldColumns = [
    { key: 'property', header: 'Property' },
    { key: 'buyer', header: 'Buyer' },
    {
      key: 'salePrice',
      header: 'Sale Price',
      className: 'text-blue-600 font-medium',
    },
    { key: 'saleDate', header: 'Sale Date' },
  ];

  const soldData: SoldPropertyData[] = transactions.map(tx => ({
    property: tx.propertyId,
    address: 'Unknown Address', // Replace with actual address if available
    buyer: `${tx.toAddress.slice(0, 6)}...${tx.toAddress.slice(-4)}`,
    salePrice: formatWeiToUSD(tx.price),
    saleDate: new Date(tx.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  }));
  if (stats) {
    console.log(`total Amount --->`, stats.totalAmount);
    console.log(`total Amount --->`, formatWeiToUSD(stats.totalAmount));
    console.log(`total amount type --->`, typeof stats.totalAmount);
    console.log(`transaction count --->`, stats.transactionCount);
  }

  const soldStats = [
    { label: 'Total Sold', value: soldData.length.toString() || '0' },
    {
      label: 'Total Revenue',
      // value: stats ? formatWeiToUSD(stats.totalAmount).toString() : '$0',
      value: stats ? formatWeiToUSD(stats.totalAmount.toString()) : '$0',
    },
    {
      label: 'Avg. Sale Price',
      value: stats?.transactionCount
        ? formatWeiToUSD(
            (
              BigInt(stats.totalAmount) / BigInt(stats.transactionCount)
            ).toString(),
          )
        : '$0',
    },
  ];

  if (loading) {
    return <div className='p-6 text-center'>Loading sold properties...</div>;
  }

  if (error) {
    return <div className='p-6 text-red-500 text-center'>Error: {error}</div>;
  }

  return (
    <DynamicPropertyTable
      title='My Sold Properties'
      viewType='Seller'
      stats={soldStats}
      columns={soldColumns}
      data={soldData}
    />
  );
};

export default SoldPropertiesView;
