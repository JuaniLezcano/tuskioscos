'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Kiosco } from '@/types';

interface KioscoItemProps {
  kiosco: Kiosco;
}

export function KioscoItem({ kiosco }: KioscoItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="border rounded-lg p-6 mb-6 shadow-lg w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleOpen}>
        <span className="text-lg font-medium">{kiosco.name}</span>
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && (
        <div className="flex justify-end gap-4 mt-4">
          <Link 
            href={`/dashboard/kioscos/${kiosco.id}/metricas`}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Métricas
          </Link>
          <Link 
            href={`/dashboard/kioscos/${kiosco.id}/cierres/nuevo`}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Cerrar Caja
          </Link>
        </div>
      )}
    </div>
  );
}