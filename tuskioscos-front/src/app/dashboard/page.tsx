"use client";

import React, { useEffect, useState } from 'react';
import { KioscoItem } from '@/components/kioscoItem';
import { Kiosco, User } from '@/types';
import Header from '@/components/header';
import { clientFetch } from '@/utils/api';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [kioscos, setKioscos] = useState<Kiosco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user data
        const userData = await clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`);
        setUser(userData);

        // Fetch kioscos
        const kioscosData = await clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/kioscos`);
        setKioscos(kioscosData);
      } catch (err) {
        setError("Error cargando datos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }
  if (error) return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  if (!user) return null;

  return (
    <div className='min-h-screen flex flex-col'>
      <header>
        <Header user={user} />
      </header>
      <div className='flex-1 flex items-center justify-center'>
        <div className='w-full max-w-4xl'>
          <div className="text-center">
            <h1 className="text-2xl font-medium mb-4">Número de Kioscos</h1>
            <p className="text-xl font-bold text-gray-900">{kioscos.length}</p>
          </div>
          <div className='my-10'>
            {kioscos.map(kiosco => (
              <KioscoItem key={kiosco.id} kiosco={kiosco} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}