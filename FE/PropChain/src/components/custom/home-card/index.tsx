import React from 'react';

interface PropertyCardProps {
  title: string;
  value: number | string;
}

const HomeCard: React.FC<PropertyCardProps> = ({ title, value }) => {
  return (
    <div className='bg-white p-9 rounded-lg shadow-sm '>
      <div className='flex justify-between items-center'>
        <div>
          <p className=' text-gray-500 text-lg'>{title}</p>
          <div className='flex items-end'>
            <h3 className='text-2xl font-bold mr-2'>{value}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
