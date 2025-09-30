import toast from 'react-hot-toast';

interface CustomWindow extends Window {
  ethereum?: any;
}

declare let window: CustomWindow;

import { useFormik } from 'formik';

export const connectMetaMask = async () => {
  if (!window.ethereum) throw new Error('MetaMask not installed');

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  if (!accounts.length) throw new Error('No accounts found');

  // Optional: Verify network
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  if (chainId !== '0x539') console.warn('Not on Ganache network');

  return accounts[0];
};
function setWalletConnected(arg0: boolean) {
  throw new Error('Function not implemented.');
}
