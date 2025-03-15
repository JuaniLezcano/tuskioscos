// app/dashboard/layout.tsx
"use client";

import AuthProvider from '@/components/authProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}