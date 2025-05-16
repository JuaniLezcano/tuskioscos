'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import Header from '@/components/header';
import { User } from '@/types';
import { clientFetch } from '@/utils/api';

interface NuevoCierreCajaProps {
  params: Promise<{
    kioscoId: string;
  }>;
}

export default function NuevoCierreCaja({ params }: NuevoCierreCajaProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDuplicateError, setIsDuplicateError] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cierresExistentes, setCierresExistentes] = useState<string[]>([]);
  const router = useRouter();
  const resolvedParams = use(params);
  const kioscoId = parseInt(resolvedParams.kioscoId);
  const [formattedDate, setFormattedDate] = useState('');


  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() - 3);
    const formatted = now.toISOString().split('T')[0];
    setFormattedDate(formatted);
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        // Ajustado para coincidir con la ruta original
        const userData = await clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`);
        setUser(userData);
      } catch (err) {
        console.error("Error al cargar usuario:", err);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchCierres() {
      try {
        // Ajustado para coincidir con la ruta original
        const cierres = await clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cierreCaja/${kioscoId}`);
        setCierresExistentes(
          cierres.map((cierre: { fecha: any }) => {
            const fecha = new Date(cierre.fecha);
            return isNaN(fecha.getTime()) ? cierre.fecha : fecha.toISOString().split('T')[0];
          })
        );
      } catch (err) {
        console.error("Error al obtener cierres de caja:", err);
      }
    }

    loadUser();
    fetchCierres();
  }, [kioscoId]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
        setIsDuplicateError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setIsDuplicateError(false);

    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const monto = formData.get('monto') as string;
    const fecha = formData.get('fecha') as string;

    try {
      // Verifica si ya existe un cierre para este kiosco específico y esta fecha
      if (cierresExistentes.includes(fecha)) {
        setIsDuplicateError(true);
        setError("Ya existe un cierre de caja para este kiosco en la fecha seleccionada");
        setIsSubmitting(false);
        return;
      }

      // Ajustado para coincidir con la ruta original
      await clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cierreCaja/${kioscoId}`, {
        method: 'POST',
        body: JSON.stringify({
          monto: Number.parseFloat(monto),
          fecha
        })
      });

      router.push(`/dashboard/kioscos/${kioscoId}/cierres`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error al crear el cierre de caja';

      if (errorMessage.includes('DUPLICATE_CIERRE')) {
        setIsDuplicateError(true);
        setError("Ya existe un cierre de caja para este kiosco en la fecha seleccionada");
      } else {
        setError(errorMessage);
      }

      setIsSubmitting(false);
    }
  }

  if (isLoading) {
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

  return (
    <div>
      {user && <Header user={user} />}
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Nuevo Cierre de Caja</h1>

        {error && (
          <div className={`border px-4 py-3 rounded mb-4 ${isDuplicateError
              ? "bg-yellow-100 border-yellow-400 text-yellow-800"
              : "bg-red-100 border-red-400 text-red-700"
            }`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              required
              defaultValue={formattedDate}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${cierresExistentes.includes(formattedDate) ? 'bg-green-100 border-green-500 text-green-800' : 'border-gray-300'
                }`}
              onChange={(e) => setFormattedDate(e.target.value)}
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
              type="button"
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => router.push(`/dashboard/kioscos/${kioscoId}/cierres`)}
            >
              Ver Cierres
            </button>

            <button
              type="submit"
              disabled={isSubmitting || cierresExistentes.includes(formattedDate)}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting || cierresExistentes.includes(formattedDate) ? 'opacity-70 cursor-not-allowed' : ''
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