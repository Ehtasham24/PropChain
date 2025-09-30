// //
// 'use client';

// import HomeCard from '@/components/custom/home-card';
// import PropertyStatus from '@/components/custom/property-status';
// import RecentTransactionItem from '@/components/custom/recent-transaction-card.tsx';
// import { ChartDashboard } from '@/components/ui/chart-dashboard';
// import dashboardCardData from '@/constants/dashboard-data';
// import RecentTransactionsData from '@/constants/recent-transactions';

// const HomeView = () => {
//   return (
//     <div className='p-6'>
//       <div className='grid grid-cols-3 gap-6 mb-6'>
//         {dashboardCardData.map(card => (
//           <HomeCard
//             title={card.title}
//             value={card.value}
//           />
//         ))}
//       </div>

//       <div className='grid grid-cols-2 gap-6 mb-6'>
//         <PropertyStatus />

//         <div className='bg-white p-6 rounded-lg shadow-sm'>
//           <h3 className='text-lg font-semibold mb-4'>Recent Transactions</h3>
//           <div className='grid grid-cols-3 gap-4 mb-2'>
//             <div className='text-sm font-medium text-gray-500'>Property</div>
//             <div className='text-sm font-medium text-gray-500'>Price</div>
//           </div>
//           <div className='space-y-3'>
//             {RecentTransactionsData.map(item => (
//               <div
//                 key={item.property}
//                 className='grid grid-cols-3 gap-4'
//               >
//                 <RecentTransactionItem
//                   price={item.price}
//                   property={item.property}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div>
//         <ChartDashboard />
//       </div>
//     </div>
//   );
// };

// export default HomeView;

'use client';

import HomeCard from '@/components/custom/home-card';
import PropertyStatus from '@/components/custom/property-status';
import { RecentTransactionItem } from '../../../components/custom/recent-transaction-card.tsx';
import { ChartDashboard } from '@/components/ui/chart-dashboard';
import dashboardCardData from '@/constants/dashboard-data';
import RecentTransactionsData from '@/constants/recent-transactions';
import { useAllProperties } from '@/services/react-query-client/auth/properties.hooks';
import User from '@/types/Interfaces/user.interface';
import { useEffect, useState } from 'react';

interface Transaction {
  _id: string;
  propertyId: string;
  price: string;
  createdAt: string;
  toAddress: {
    name: string;
    walletAddress: string;
  };
  fromAddress: {
    name: string;
    walletAddress: string;
  };
}

const HomeView = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch properties
        const propsResponse = await fetch(
          'http://localhost:8000/v1/api/properties',
        );
        if (!propsResponse.ok) throw new Error('Failed to fetch properties');
        const propsData = await propsResponse.json();

        // Fetch transactions
        const transResponse = await fetch(
          'http://localhost:8000/v1/transactions/withUsers',
        );
        if (!transResponse.ok) throw new Error('Failed to fetch transactions');
        const transData = await transResponse.json();

        // Process data
        setProperties(propsData);

        // Sort transactions by date and get latest 5
        const sortedTransactions = transData
          .sort(
            (a: Transaction, b: Transaction) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5);

        setTransactions(sortedTransactions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalValue = properties.reduce((sum, property) => {
    const priceInWei = parseFloat(property.price) || 0;
    return sum + priceInWei / 10 ** 18; // Convert from wei to ETH
  }, 0);

  const activeOffers = properties.filter(property => property.isActive).length;
  if (isLoading) {
    return <div className='p-6'>Loading data...</div>;
  }

  if (error) {
    return <div className='p-6 text-red-500'>Error: {error}</div>;
  }
  return (
    <div className='p-6'>
      <div className='grid grid-cols-3 gap-6 mb-6'>
        {dashboardCardData.map(card => (
          <HomeCard
            key={card.title}
            title={card.title}
            value={
              card.title === 'Listed Properties'
                ? properties.length.toString()
                : card.title === 'Properties Valued At'
                  ? `${totalValue.toFixed(1)} ETH`
                  : card.title === 'Active Properties'
                    ? activeOffers.toString()
                    : ''
            }
          />
        ))}
      </div>

      {/* Rest of your component remains the same */}
      <div className='grid grid-cols-2 gap-6 mb-6'>
        <PropertyStatus properties={properties} />

        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <h3 className='text-lg font-semibold mb-4'>Recent Transactions</h3>
          <div className='grid grid-cols-3 gap-4 mb-2'>
            <div className='text-sm font-medium text-gray-500'>Property</div>
            <div className='text-sm font-medium text-gray-500'>Price</div>
            <div className='text-sm font-medium text-gray-500'>Time</div>
          </div>
          <div className='space-y-3'>
            {transactions.map(transaction => (
              <div
                key={transaction._id}
                className='grid grid-cols-3  gap-4'
              >
                <RecentTransactionItem
                  property={transaction.propertyId}
                  price={transaction.price}
                  createdAt={transaction.createdAt}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <ChartDashboard />
      </div>
    </div>
  );
};

export default HomeView;
