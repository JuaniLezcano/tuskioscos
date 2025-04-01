'use client';

import { useState, useEffect } from 'react';
import { clientFetch } from '@/utils/api';
import Link from 'next/link';
import { CierreCaja } from '@/types';
import Header from '@/components/header';
import { useParams } from 'next/navigation';

export default function ListaCierresCaja() {
  const params = useParams();
  const kioscoId = parseInt(params.kioscoId as string);

  // State for data
  const [cierresCaja, setCierresCaja] = useState<CierreCaja[]>([]);
  const [kiosco, setKiosco] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estado para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCierre, setSelectedCierre] = useState<CierreCaja | null>(null);
  const [monto, setMonto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [userResult, kioscoResult, cierresResult] = await Promise.all([
          clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`),
          clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/kioscos/${kioscoId}`),
          clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cierreCaja/${kioscoId}`)
        ]);

        setUser(userResult);
        setKiosco(kioscoResult);
        setCierresCaja(cierresResult);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [kioscoId]);

  // Función para formatear fechas
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para formatear montos
  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  };

  // Abrir modal con los datos del cierre seleccionado
  const openEditModal = (cierre: CierreCaja) => {
    setSelectedCierre(cierre);
    setMonto(cierre.monto.toString());
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCierre(null);
    setMonto('');
    setError(null);
    setSuccess(null);
  };

  // Manejar la actualización del cierre de caja
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCierre) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Crear FormData para enviar al server action
      const formData = new FormData();
      formData.append('monto', monto);

      const id = selectedCierre.id

      await clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cierreCaja/${kioscoId}`), {
        method: 'PUT',
        body: JSON.stringify({ id, formData })
      }

      setSuccess('Cierre de caja actualizado correctamente');

      // Actualizar los datos localmente sin recargar la página
      const updatedCierres = cierresCaja.map(cierre =>
        cierre.id === selectedCierre.id
          ? { ...cierre, monto: parseFloat(monto) }
          : cierre
      );
      setCierresCaja(updatedCierres);

      // Cerrar el modal después de un breve tiempo
      setTimeout(() => {
        closeModal();
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el cierre de caja');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div>
      {user && <Header user={user} />}
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cierres de Caja de {kiosco?.name}</h1>
          <Link
            href={`/dashboard/kioscos/${kioscoId}/cierres/nuevo`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Nuevo Cierre
          </Link>
        </div>

        {cierresCaja.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No hay cierres de caja registrados</p>
            <Link
              href={`/dashboard/kioscos/${kioscoId}/cierres/nuevo`}
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Registrar el primer cierre
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cierresCaja.map((cierre: CierreCaja) => (
                  <tr key={cierre.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(cierre.fecha)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatMonto(cierre.monto)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(cierre)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {isModalOpen && selectedCierre && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Editar Cierre de Caja</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="text"
                  value={formatDate(selectedCierre.fecha)}
                  className="w-full p-2 border rounded bg-gray-50"
                  disabled
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto
                </label>
                <input
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  step="0.01"
                  min="0"
                />
              </div>

              {error && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
                  {success}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}