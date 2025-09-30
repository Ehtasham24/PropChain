import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  className = '',
}) => {
  const baseStyles = 'rounded-lg transition-colors transition-colors';

  const variantStyles = {
    primary: 'bg-lightBlue text-black',
    secondary: 'bg-neutral-grey text-white',
    outline: '',
    danger: '',
  };

  const sizeStyles = {
    sm: '',
    md: 'py-2 w-[80%] h-12',
    lg: 'ml-[30px] py-2 w-[90%] h-[60px]',
  };

  return (
    <div>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={` ${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    </div>
  );
};

export default ButtonComponent;
