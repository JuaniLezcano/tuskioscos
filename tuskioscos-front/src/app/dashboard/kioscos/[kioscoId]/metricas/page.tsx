'use client'

import React, { useState, useEffect } from 'react'
import { CierreCaja, Kiosco, User } from '@/types'
import { useParams } from 'next/navigation'
import Header from '@/components/header'
import { clientFetch } from '@/utils/api'
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { es } from 'date-fns/locale';

export default function Metricas() {
  const { kioscoId } = useParams()
  const [user, setUser] = useState<User | null>(null);
  const [kiosco, setKiosco] = useState<Kiosco | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: getOneMonthAgo(),
    endDate: getTodayISO()
  })
  const [metrics, setMetrics] = useState<{
    cierresEntreFechas: CierreCaja[],
    diasLaborales: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`);
        setUser(userData);
  
        if (!kioscoId) {
          throw new Error('ID de kiosco no encontrado');
        }
  
        const kioscoData = await clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/kioscos/${kioscoId}`);
        setKiosco(kioscoData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
  
    fetchData();
    fetchMetrics();
  }, [kioscoId]); 
  
  function getTodayISO() {
    return new Date().toISOString().split('T')[0]
  }
  
  function getOneMonthAgo() {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    return oneMonthAgo.toISOString().split('T')[0]; // yyyy-MM-dd
  }
  

  function formatDate(date: Date | string) {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const zonedDate = toZonedTime(dateObj, 'UTC');

    return format(zonedDate, 'dd/MM/yyyy', { locale: es });
  }

  async function fetchMetrics() {
    try {
      setLoading(true)
      setError(null)

      const fecha1 = new Date(dateRange.startDate)
      const fecha2 = new Date(dateRange.endDate + 'T23:59:59.999Z')

      // Ensure kioscoId is a number
      const kioscoIdNumber = Number(kioscoId)

      if (isNaN(kioscoIdNumber)) {
        throw new Error('ID de kiosco inválido')
      }

      const response = await clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cierreCaja/${kioscoIdNumber}`)
      const cierresEntreFechas = response.filter((cierre : CierreCaja) => {
        const fechaCierre = new Date(cierre.fecha)
        return fechaCierre >= fecha1 && fechaCierre <= fecha2
      })
    
      // Ordenar por fecha (más reciente primero)
      cierresEntreFechas.sort((a : CierreCaja, b : CierreCaja) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    
      // Calcular días laborales (días con cierre de caja)
      const diasLaborales = cierresEntreFechas.length
      setMetrics({cierresEntreFechas, diasLaborales})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar métricas')
      console.error('Error fetching metrics:', err)
    } finally {
      setLoading(false)
    }
  }

  function calculateTotalAmount() {
    if (!metrics?.cierresEntreFechas?.length) return 0
    return metrics.cierresEntreFechas.reduce((sum, cierre) => sum + cierre.monto, 0)
  }

  function calculateDailyAverage() {
    if (!metrics?.cierresEntreFechas?.length) return 0
    const total = calculateTotalAmount()
    return total / metrics.diasLaborales
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetchMetrics()
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  return (
    <div>
      {user && <Header user={user} />}
      <div className="w-full max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Métricas de {kiosco ? kiosco.name : 'Nombre del Kiosco'}</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Filtrar por fechas</h2>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha inicial
              </label>
              <input
                type="date"
                id="startDate"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="flex-1">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha final
              </label>
              <input
                type="date"
                id="endDate"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full md:w-auto"
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Aplicar'}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-medium text-gray-500 mb-2">Total Recaudado</h3>
              <p className="text-3xl font-bold">{formatCurrency(calculateTotalAmount())}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-medium text-gray-500 mb-2">Días con Actividad</h3>
              <p className="text-3xl font-bold">{metrics.diasLaborales}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-medium text-gray-500 mb-2">Promedio Diario</h3>
              <p className="text-3xl font-bold">{formatCurrency(calculateDailyAverage())}</p>
            </div>
          </div>
        )}

        {metrics?.cierresEntreFechas && metrics.cierresEntreFechas.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-lg font-medium p-4 bg-gray-50 border-b">Detalle de Cierres de Caja</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrics.cierresEntreFechas.map((cierre) => (
                    <tr key={cierre.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(new Date(cierre.fecha))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {formatCurrency(cierre.monto)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-bold">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold">
                      {formatCurrency(calculateTotalAmount())}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ) : metrics && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No hay datos de cierres de caja en el período seleccionado</p>
          </div>
        )}
      </div>
    </div>
  )
}