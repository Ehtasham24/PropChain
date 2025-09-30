'use client';

import React from 'react';
import SideBar from '@/components/custom/sidebar';
import Navbar from '@/components/custom/navbar';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: AuthLayoutProps) {
  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className='flex-1 overflow-auto'>
        {/* Navbar Header */}
        <Navbar title=' Dashboard' />

        {/* Render the children (dynamic content) */}
        {children}
      </div>
    </div>
  );
}
