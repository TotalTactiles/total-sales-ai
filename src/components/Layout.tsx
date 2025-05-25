// src/components/Layout.tsx
import React from 'react';
import Header from './Header'; // Adjust path if different

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="pt-16 px-4 md:px-8">{children}</main> {/* Adjust padding as needed */}
    </>
  );
};

export default Layout;
