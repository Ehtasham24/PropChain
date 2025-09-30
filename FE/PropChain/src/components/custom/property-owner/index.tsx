import OwnerEntry from '@/components/custom/owner-entry';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

// Define types for Property Ownership
// type Owner = {
//   name: string;
//   walletAddress: string;
//   isCurrentOwner?: boolean;
// };

type Property = {
  name: string;
  address: string;
  ownershipHistory: Owner[];
};

type Owner = {
  walletAddress: string;
};

interface OwnershipHistoryProps {
  ownershipHistory: Owner[];
  address: string;
  closeModal: () => void;
}

// Property Ownership History Component
const PropertyOwnershipHistoryComp: React.FC<OwnershipHistoryProps> = ({
  ownershipHistory,
  address,
  closeModal,
}) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
      <Card className='w-full max-w-[45%] mx-auto bg-white shadow-2xl rounded-xl p-6 relative'>
        {/* Header */}
        <CardHeader className='border-b pb-4'>
          <CardTitle className='text-xl font-bold text-gray-800'>
            Ownership History
          </CardTitle>
          <p className='text-gray-500 text-sm'>{address}</p>
        </CardHeader>

        {/* Ownership List */}
        <CardContent className='py-6'>
          <div className='space-y-4'>
            {ownershipHistory.map((owner, index) => (
              <OwnerEntry
                key={`${owner.walletAddress}-${index}`}
                {...owner}
                position={index}
              />
            ))}
          </div>
        </CardContent>

        {/* Footer */}
        <div className='flex items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t'>
          <div className='flex items-center gap-2'>
            <Shield className='w-4 h-4 text-green-500' />
            <span>Blockchain Verified Ownership</span>
          </div>
          <button
            onClick={closeModal}
            className='font-bold text-blue-600 hover:text-blue-800 transition'
          >
            Close
          </button>
        </div>
      </Card>
    </div>
  );
};

export default PropertyOwnershipHistoryComp;
