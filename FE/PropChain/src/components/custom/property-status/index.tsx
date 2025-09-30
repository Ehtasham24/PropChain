import React from 'react';

interface Property {
  isActive: boolean;
}

interface Props {
  properties: Property[];
}

const PropertyStatus = ({ properties }: Props) => {
  // Calculate active/inactive counts
  const activeCount = properties.filter(prop => prop.isActive).length;
  const inactiveCount = properties.length - activeCount;
  const totalProperties = properties.length;

  // Calculate percentages
  const activePercentage =
    totalProperties > 0 ? (activeCount / totalProperties) * 100 : 0;
  const inactivePercentage =
    totalProperties > 0 ? (inactiveCount / totalProperties) * 100 : 0;

  const statusData = [
    {
      status: 'Available',
      percentage: activePercentage,
      color: 'bg-green-400',
    },
    {
      status: 'Not Available',
      percentage: inactivePercentage,
      color: 'bg-red-400',
    },
  ];

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm'>
      <h3 className='text-lg font-semibold mb-4'>Property Status</h3>
      <div className='space-y-4'>
        {statusData.map(item => (
          <div key={item.status}>
            <div className='flex justify-between mb-1'>
              <span className='text-sm text-gray-600'>{item.status}</span>
              <span className='text-sm text-gray-500'>
                {item.percentage.toFixed(1)}%
              </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className={`${item.color} h-2 rounded-full`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyStatus;
