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
      <div role="status" className="flex justify-center items-center min-h-screen">
        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-900" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Cargando...</span>
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
          {kioscos.length === 0 && (
            <div className="text-center mt-10">
              <p className="text-gray-500 text-bold">No hay kioscos disponibles, agrega kioscos apretando en tu imagen de perfil &gt; gestionar kioscos.</p>
            </div>
          )}
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