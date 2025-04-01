'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Kiosco } from '@/types';
import { FiMinus, FiPlus } from 'react-icons/fi';

interface KioscoItemProps {
  kiosco: Kiosco;
}

export function KioscoItem({ kiosco }: KioscoItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border rounded-lg p-6 mb-6 shadow-lg w-full max-w-4xl mx-auto hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer" onClick={toggleOpen}>
      <div className="flex justify-between items-center" >
        <span className="text-lg font-medium ">{kiosco.name}</span>
        <span className="text-xl">
          {isOpen ? <FiMinus /> : <FiPlus />}
        </span>
      </div>
      {isOpen && (
        <div className="flex justify-end gap-4 mt-4">
          <Link
            href={`/dashboard/kioscos/${kiosco.id}/metricas`}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={(e) => e.stopPropagation()}
          >
            Métricas
          </Link>
          <Link
            href={`/dashboard/kioscos/${kiosco.id}/cierres/nuevo`}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-950 transition"
            onClick={(e) => e.stopPropagation()}
          >
            Cerrar Caja
          </Link>
        </div>
      )}
    </div>
  );
}