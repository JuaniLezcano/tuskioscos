'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createCierreCaja } from '@/app/actions/cierreCaja';
import { use } from 'react';
import Header from '@/components/header';
import { User } from '@/types';
import { getUser } from '@/app/actions/user';

interface NuevoCierreCajaProps {
  params: Promise<{
    kioscoId: string;
  }>;
}

export default function NuevoCierreCaja({ params }: NuevoCierreCajaProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const resolvedParams = use(params);
  const kioscoId = parseInt(resolvedParams.kioscoId);

  // Formatear fecha actual para el input type="date"
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const today = new Date();
    setFormattedDate(today.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (err) {
        console.error("Error al cargar usuario:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUser();
  }, []);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      await createCierreCaja(kioscoId, formData);
      router.push(`/kioscos/${kioscoId}/cierres`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al crear el cierre de caja');
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {user && <Header user={user} />}
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        {/* Resto de tu JSX como estaba */}
        <h1 className="text-2xl font-bold mb-6 text-center">Nuevo Cierre de Caja</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form action={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-2">
              Monto
            </label>
            <input
              type="number"
              id="monto"
              name="monto"
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              defaultValue={formattedDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}