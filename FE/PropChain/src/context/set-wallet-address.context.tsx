'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletAddressContextType {
  walletAddress: string;
  setWalletAddress: (_walletAddress: string) => void;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
}

export const WalletAddressContext = createContext<
  WalletAddressContextType | undefined
>(undefined); // undefined is the initial value

interface WalletAddressProviderProps {
  children: ReactNode;
}

export const WalletAddressProvider = ({
  children,
}: WalletAddressProviderProps) => {
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    // Implement your wallet connection logic here
  };

  const isConnected = !!walletAddress;

  console.log('Provider Rendered:', walletAddress);

  return (
    <WalletAddressContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
        connectWallet,
        isConnected,
      }}
    >
      {children}
    </WalletAddressContext.Provider>
  );
};

export const useWalletAddress = () => {
  const context = useContext(WalletAddressContext);
  if (!context) {
    throw new Error(
      'useWalletAddress must be used within a WalletAddressProvider',
    );
  }
  return context;
};
