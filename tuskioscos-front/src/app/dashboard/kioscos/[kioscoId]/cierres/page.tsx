'use client';

import { useState, useEffect } from 'react';
import { clientFetch } from '@/utils/api';
import Link from 'next/link';
import { CierreCaja } from '@/types';
import Header from '@/components/header';
import { useParams } from 'next/navigation';
import { format, parseISO, set } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { es } from 'date-fns/locale';

export default function ListaCierresCaja() {
  const params = useParams();
  const kioscoId = parseInt(params.kioscoId as string);

  // State para datos
  const [cierresCaja, setCierresCaja] = useState<CierreCaja[]>([]);
  const [kiosco, setKiosco] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estado para controlar el modal
  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const [selectedCierre, setSelectedCierre] = useState<CierreCaja | null>(null);
  const [monto, setMonto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch data al montar el componente
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
        setCierresCaja(cierresResult.sort((a: CierreCaja, b: CierreCaja) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [kioscoId]);

  const formatDate = (date: Date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const zonedDate = toZonedTime(dateObj, 'America/Argentina/Buenos_Aires');

    return format(zonedDate, 'dd/MM/yyyy', { locale: es });
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
    setisEditModalOpen(true);
  };

  const openDeleteModal = (cierre: CierreCaja) => {
    setSelectedCierre(cierre);
    setError(null);
    setSuccess(null)
    setIsDeleteModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setisEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCierre(null);
    setMonto('');
    setError(null);
    setSuccess(null);
  };

  // Función para eliminar un kiosco
  const deleteKiosco = async (cierreId: number) => {
    return clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cierreCaja/${kioscoId}/${cierreId}`, {
      method: 'DELETE'
    });
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCierre) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await deleteKiosco(selectedCierre.id);

      setSuccess('Cierre de caja eliminado correctamente');

      const updatedCierres = cierresCaja.filter(cierre => cierre.id !== selectedCierre.id);
      
      setCierresCaja(updatedCierres);

      setTimeout(() => {
        closeModal();
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el cierre de caja');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar la actualización del cierre de caja
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCierre) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const id = selectedCierre.id;

      await clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cierreCaja/${kioscoId}/${selectedCierre.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, monto: parseFloat(monto) })
      });

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
      <div className="min-h-screen bg-gray-50">
        {user && <Header user={user} />}
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-900" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Cargando informacion...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Header user={user} />}
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Cierres de Caja</h1>
            <p className="text-gray-600 mt-1">{kiosco?.name}</p>
          </div>
          <Link
            href={`/dashboard/kioscos/${kioscoId}/cierres/nuevo`}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-950 transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Cierre
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {cierresCaja.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="mt-2 text-gray-500">No hay cierres de caja registrados</p>
            <Link
              href={`/dashboard/kioscos/${kioscoId}/cierres/nuevo`}
              className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Registrar el primer cierre
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th scope="col" className="px-14 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cierresCaja.map((cierre: CierreCaja) => (
                    <tr key={cierre.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(cierre.fecha)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatMonto(cierre.monto)}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => openEditModal(cierre)}
                          className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => openDeleteModal(cierre)}
                          className="text-red-600 hover:text-red-800 transition-colors inline-flex items-center ml-4"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-6 0V5a1 1 0 011-1h4a1 1 0 011 1v2" />
                          </svg>
                          Borrar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {isEditModalOpen && selectedCierre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Editar Cierre de Caja</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 focus:outline-none"
                aria-label="Cerrar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6">
              <div className="mb-4">
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  id="fecha"
                  type="text"
                  value={formatDate(selectedCierre.fecha)}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="mb-6">
                <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-1">
                  Monto
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    $
                  </span>
                  <input
                    id="monto"
                    type="number"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {success}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </span>
                  ) : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de eliminación */}
      {isDeleteModalOpen && selectedCierre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Borrar Cierre de Caja</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 focus:outline-none"
                aria-label="Cerrar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleDelete} className="p-6">
              <p className="text-gray-700 mb-4">¿Estás seguro de que deseas eliminar el cierre de caja del {formatDate(selectedCierre.fecha)}?</p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Eliminar
                </button>
              </div>
              {success && (
                <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {success}
                  </div>
                </div>
              )}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
            </form>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}