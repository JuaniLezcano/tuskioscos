'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createCierreCaja, getAllCierreCaja } from '@/app/actions/cierreCaja';
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
  const [isDuplicateError, setIsDuplicateError] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cierresExistentes, setCierresExistentes] = useState<string[]>([]);
  const router = useRouter();
  const resolvedParams = use(params);
  const kioscoId = parseInt(resolvedParams.kioscoId);
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

    async function fetchCierres() {
      try {
        // Asegúrate que getAllCierreCaja filtra por kioscoId
        const cierres = await getAllCierreCaja(kioscoId);
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

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    setIsDuplicateError(false);

    try {
      // Verifica si ya existe un cierre para este kiosco específico y esta fecha
      const fechaSeleccionada = formData.get('fecha') as string;
      
      if (cierresExistentes.includes(fechaSeleccionada)) {
        setIsDuplicateError(true);
        setError("Ya existe un cierre de caja para este kiosco en la fecha seleccionada");
        setIsSubmitting(false);
        return;
      }
      
      await createCierreCaja(kioscoId, formData);
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
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {user && <Header user={user} />}
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Nuevo Cierre de Caja</h1>

        {error && (
          <div className={`border px-4 py-3 rounded mb-4 ${
            isDuplicateError
              ? "bg-yellow-100 border-yellow-400 text-yellow-800"
              : "bg-red-100 border-red-400 text-red-700"
          }`}>
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
              required
              defaultValue={formattedDate}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                cierresExistentes.includes(formattedDate) ? 'bg-green-100 border-green-500 text-green-800' : 'border-gray-300'
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
              type="submit"
              disabled={isSubmitting || cierresExistentes.includes(formattedDate)}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isSubmitting || cierresExistentes.includes(formattedDate) ? 'opacity-70 cursor-not-allowed' : ''
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