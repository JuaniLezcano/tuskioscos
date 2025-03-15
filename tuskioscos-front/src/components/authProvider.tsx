// components/AuthProvider.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  useEffect(() => {
    // Verificar token al cargar la página
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return <>{children}</>;
}