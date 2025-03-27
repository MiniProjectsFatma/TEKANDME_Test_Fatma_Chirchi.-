'use client';

import React from 'react';
import { Container } from 'react-bootstrap';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      {children}
    </div>
  );
}
