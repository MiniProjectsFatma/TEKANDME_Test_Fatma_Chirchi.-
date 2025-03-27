'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navigation />
      <main className="py-4">
        {children}
      </main>
    </AuthProvider>
  );
}
