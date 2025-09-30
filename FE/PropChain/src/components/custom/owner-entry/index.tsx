import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

// Define the props type
interface OwnerEntryProps {
  // name: string;
  walletAddress: string;
  isCurrentOwner?: boolean;
  position: number;
}

// Individual Owner Entry Component
const OwnerEntry: React.FC<OwnerEntryProps> = ({
  //name,
  walletAddress,
  isCurrentOwner = false,
  position,
}) => {
  const getColorByPosition = (pos: number): string => {
    const colors = [
      'bg-green-100 border-green-500',
      'bg-blue-100 border-blue-500',
      'bg-red-100 border-red-500',
      'bg-yellow-100 border-yellow-500',
    ];
    return colors[pos % colors.length];
  };

  return (
    <div className='relative flex items-center mb-4 pl-6'>
      {/* Vertical Line */}
      {position > 0 && (
        <div
          className='absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300'
          style={{ left: '-1.5rem' }}
        />
      )}

      {/* Owner Indicator */}
      <div
        className={`
          w-10 h-10 rounded-full mr-4 z-10 relative flex items-center justify-center
          border-2 ${getColorByPosition(position)}
          ${isCurrentOwner ? 'ring-2 ring-blue-500' : ''}
        `}
      >
        <span className='text-xs p-4 font-bold opacity-70'>{position + 1}</span>
      </div>

      {/* Owner Details */}
      <div>
        <div className='flex items-center'>
          <span className='font-semibold text-gray-800 mr-2'>
            {walletAddress}
          </span>
          {isCurrentOwner && (
            <span className='bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full'>
              Current Owner
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerEntry;
