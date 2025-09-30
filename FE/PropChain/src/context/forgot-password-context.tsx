import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ForgotPasswordContextType {
  email: string;
  setEmail: (_email: string) => void;
  otp: string;
  setOtp: (_otp: string) => void;
  isVerified: boolean;
  setIsVerified: (_isVerified: boolean) => void;
}

export const ForgotPasswordContext = createContext<
  ForgotPasswordContextType | undefined
>(undefined);

interface ForgotPasswordProviderProps {
  children: ReactNode;
}

export const ForgotPasswordProvider = ({
  children,
}: ForgotPasswordProviderProps) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  return (
    <ForgotPasswordContext.Provider
      value={{
        email,
        setEmail,
        otp,
        setOtp,
        isVerified,
        setIsVerified,
      }}
    >
      {children}
    </ForgotPasswordContext.Provider>
  );
};

export const useForgotPassword = () => {
  const context = useContext(ForgotPasswordContext);
  if (!context) {
    throw new Error(
      'useForgotPassword must be used within a ForgotPasswordProvider',
    );
  }
  return context;
};
