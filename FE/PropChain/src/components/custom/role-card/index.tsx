import React from 'react';
import { useRouter } from 'next/navigation';
import { setCookieClientSideFn } from '@/utils/storage.util';

interface RoleCardProps {
  title: string;
  icon: React.ReactNode;
  description: string[];
  buttonText: string;
  bgColor: string;
  iconColor: string;
  role: string;
}

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  icon,
  description,
  buttonText,
  bgColor,
  iconColor,
  role,
}) => {
  const router = useRouter();

  const handleClick = () => {
    setCookieClientSideFn('role', role);
    router.push('/signup');
  };

  return (
    <div
      className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex-1`}
    >
      <div className={`h-2 ${bgColor} rounded-t-md`}></div>
      <div className='p-6 flex flex-col items-center'>
        {/* Icon */}
        <div
          className={`bg-${iconColor}-50 rounded-full w-24 h-24 flex items-center justify-center mb-6`}
        >
          <div
            className={`bg-${iconColor}-100 rounded-full w-20 h-20 flex items-center justify-center`}
          >
            {icon}
          </div>
        </div>

        {/* Text */}
        <h2 className='font-bold text-xl text-gray-800 mb-4'>{title}</h2>
        <ul className='text-gray-500 space-y-2 mb-6'>
          {description.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>

        {/* Button */}
        <button
          className={`w-full ${bgColor} hover:${bgColor} text-white font-semibold py-3 px-4 rounded-lg shadow transition-colors duration-200 mt-auto`}
          onClick={handleClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default RoleCard;
