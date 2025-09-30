'use client';
import { AuthLayOutComponent } from '@/components/custom/layouts/auth.Layout';
import { ForgotPasswordProvider } from '@/context/forgot-password-context';

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const Authlayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <ForgotPasswordProvider>
      <AuthLayOutComponent>{children}</AuthLayOutComponent>
    </ForgotPasswordProvider>
  );
};
8;
export default Authlayout;
