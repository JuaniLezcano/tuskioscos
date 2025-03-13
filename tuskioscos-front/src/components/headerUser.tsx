import { User } from '@/types';
import React from 'react';

interface UserMenuProps {
  name: string;
}

export function HeaderUser ({ name }: UserMenuProps) {
  return (
    <div className='absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-64'>
      <p className='text-gray-500 text-sm'>Hola</p>
      <p className='font-bold text-lg'>{name}</p>
      <hr className='my-2' />
      <button
        className='w-full bg-gray-800 text-white py-2 rounded-lg mb-2 hover:bg-gray-700'>
        Gestionar Kioscos
      </button>
      <button
        className='w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-400'>
        Cerrar Sesión
      </button>
    </div>
  );
};


