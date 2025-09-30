import React from 'react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

// Type definitions
interface ColumnDef {
  key: string;
  header: string;
  className?: string;
}

interface StatItem {
  label: string;
  value: string;
}

interface DynamicPropertyTableProps {
  title: string;
  viewType: string;
  stats: StatItem[];
  columns: ColumnDef[];
  data: Record<string, any>[];
  onActivate?: (propertyId: string, ownerAddress: string) => void;
  onUpdatePrice?: (propertyId: string, newPrice: string) => void;
  walletAddress?: string;
  metaMask?: any;
}

const DynamicPropertyTable: React.FC<DynamicPropertyTableProps> = ({
  title,
  viewType,
  stats = [],
  columns = [],
  data = [],
  onActivate,
  onUpdatePrice,
  walletAddress,
  metaMask,
}) => {
  console.log('data--->', data);
  const handlePriceUpdate = async (
    propertyId: string,
    ownerAddress: string,
  ) => {
    console.log('propertyId--->', propertyId);
    console.log('ownerAddress--->', ownerAddress);
    console.log(`metaMask--->`, metaMask);
    if (!metaMask) {
      toast.error('MetaMask not connected');
      return;
    }
    if (ownerAddress.toLowerCase() !== metaMask?.toLowerCase()) {
      toast.error('Only owner can update price for this property');
      return;
    }
    const { value: newPrice } = await Swal.fire({
      title: 'Enter new price',
      input: 'text',
      inputLabel: 'New Price',
      inputPlaceholder: 'Enter new price here...',
      showCancelButton: true,
    });

    if (newPrice && onUpdatePrice) {
      onUpdatePrice(propertyId, newPrice);
    }
  };

  return (
    <div className='p-6 bg-white rounded-lg shadow-sm'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>{title}</h2>
        <button className='px-4 py-2 bg-purple-400 text-white rounded-lg'>
          {viewType} View
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-3 gap-4 mb-6'>
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-md ${
              index === 0
                ? 'bg-blue-50'
                : index === 1
                  ? 'bg-green-50'
                  : 'bg-orange-50'
            }`}
          >
            <div className='text-gray-700'>{stat.label}</div>
            <div
              className={`text-2xl font-bold ${
                index === 0
                  ? 'text-blue-500'
                  : index === 1
                    ? 'text-green-500'
                    : 'text-orange-500'
              }`}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className='border rounded-md overflow-hidden'>
        {/* Table Header */}
        <div
          className='grid gap-4 bg-gray-100 p-3'
          style={{
            gridTemplateColumns: `repeat(${columns.length + (viewType !== 'seller' ? 2 : 0)}, minmax(0, 1fr))`,
          }}
        >
          {columns.map((column, index) => (
            <div
              key={index}
              className='font-medium text-gray-700'
            >
              {column.header}
            </div>
          ))}
          {viewType == 'buyer' && (
            <div className='font-medium text-gray-700'>Actions</div>
          )}
          {viewType == 'buyer' && (
            <div className='font-medium text-gray-700'>Price Update</div>
          )}
        </div>

        {/* Table Body */}
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className='grid gap-8 my py-8 p-3 border-t'
            style={{
              gridTemplateColumns: `repeat(${columns.length + (viewType !== 'seller' ? 2 : 0)}, minmax(0, 1fr))`,
            }}
          >
            {columns.map((column, colIndex) => (
              <div
                key={colIndex}
                className={column.className || ''}
              >
                {row[column.key]}
              </div>
            ))}
            {viewType === 'buyer' && (
              <div className='flex space-x-2'>
                {!row.isActive ? (
                  <button
                    className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm'
                    onClick={() => onActivate?.(row.property, row.ownerAddress)}
                  >
                    Activate Property
                  </button>
                ) : (
                  <button
                    className='px-3 py-1 bg-gray-500 text-white rounded text-sm cursor-not-allowed'
                    disabled
                  >
                    Property already Active
                  </button>
                )}
              </div>
            )}
            {viewType == 'buyer' && (
              <div>
                <button
                  className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm'
                  onClick={() =>
                    handlePriceUpdate(row.property, row.ownerAddress)
                  }
                >
                  Update Price
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicPropertyTable;
