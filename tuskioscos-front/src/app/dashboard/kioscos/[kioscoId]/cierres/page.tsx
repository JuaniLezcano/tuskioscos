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
          ? {...cierre, monto: parseFloat(monto)} 
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {user && <Header user={user}/>}
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