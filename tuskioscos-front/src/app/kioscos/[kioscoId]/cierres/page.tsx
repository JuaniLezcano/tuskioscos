import { getAllCierreCaja } from '@/app/actions/cierreCaja';
import Link from 'next/link';
import { CierreCaja } from '@/types';
import { use } from 'react';
import { getKiosco } from '@/app/actions/kioscos';

interface ListaCierresCajaProps {
  params: Promise<{
    kioscoId: string;
  }>;
}

export default function ListaCierresCaja({ params }: ListaCierresCajaProps) {
  const resolvedParams = use(params);
  const kioscoId = parseInt(resolvedParams.kioscoId);
  const cierresCaja = use(getAllCierreCaja(kioscoId));
  const kiosco = use(getKiosco(kioscoId));

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cierres de Caja de {kiosco.name}</h1>
        <Link 
          href={`/kioscos/${kioscoId}/cierres/nuevo`}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nuevo Cierre
        </Link>
      </div>
      
      {cierresCaja.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay cierres de caja registrados</p>
          <Link 
            href={`/kioscos/${kioscoId}/cierres/nuevo`}
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
                    <Link 
                      href={`/kioscos/${kioscoId}/cierres/${cierre.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Ver
                    </Link>
                    <Link 
                      href={`/kioscos/${kioscoId}/cierres/${cierre.id}/editar`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}