'use client';

import React from 'react';
import { Kiosco } from '@/types';

interface KioscoItemProps {
  kiosco: Kiosco;
}


export function KioscoItem({ kiosco }: KioscoItemProps) {
  return (
      <div className="border rounded-lg p-4 mb-2 flex justify-between items-center">
          <span>{kiosco.name}</span>
          <div className="flex gap-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Métricas</button>
              <button className="bg-gray-800 text-white px-4 py-2 rounded">Cerrar Caja</button>
          </div>
      </div>
  );
}