"use client";
import { User } from '@/types';
import React, { useState } from 'react';
import { ProfileImage } from "./profileImage";
import { FiHome, FiLogOut, FiSettings } from 'react-icons/fi';
import { useRouter, usePathname } from 'next/navigation';
import { clientFetch } from '@/utils/api';

interface UserProps {
  user: User;
}

export default function Header({ user }: UserProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => {
    if (window.innerWidth < 768) {
      setIsMobileModalOpen(true); // En móviles, abre modal en vez de desplegable
  } else {
      setIsMenuOpen(!isMenuOpen); // En escritorio, usa desplegable normal
  }
  };

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  function GestionarKioscos() {
    router.push("/dashboard/kioscos")
  }

  async function CerrarSesion() {
    try {
      const response = await clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.success !== true) {
        throw new Error(response.error || `Error ${response.status}`);
      }

      localStorage.removeItem('token');
      router.push("/");
    } catch (error: any) {
      console.log("Error en clientFetch:", error.message);
    }
  }

  return (
    <div className='bg-gray-custom shadow-sm'>
      <div className='max-w-full mx-auto py-4 px-6 flex items-center justify-between'>
        {pathname !== '/dashboard' && (
          <button
            onClick={navigateToDashboard}
            className="p-3 rounded-full hover:bg-gray-300 transition text-xl sm:text-2xl"
            aria-label="Ir al dashboard">
            <FiHome className="text-black-custom hover:text-gray-900" />
          </button>
        )}
        {pathname === '/dashboard' && (
          <h1 className='text-xl font-bold text-black-custom'>Tuskioscos</h1>
        )}

        <div className='relative flex items-center cursor-pointer' onClick={toggleMenu}>
          <ProfileImage name={user.name} />
        </div>
      </div>

      {isMenuOpen && window.innerWidth >= 768 && (
        <div className='flex justify-center'>
          <div className='absolute top-20 right-0 bg-white shadow-lg rounded-lg p-5 w-44 sm:w-48 md:w-56 lg:w-64'>
            <p className='text-black-custom text-sm'>Hola</p>
            <p className='font-bold text-lg'>{user.name}</p>
            <hr className='my-3' />
            <button
              onClick={GestionarKioscos}
              className='w-full flex items-center justify-center bg-black-custom text-white py-2 rounded-lg mb-2 hover:bg-gray-700 transition'>
              <FiSettings className="mr-2" /> Gestionar Kioscos
            </button>
            <button
              onClick={CerrarSesion}
              className='w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-400 transition'>
              <FiLogOut className="mr-2" /> Cerrar Sesión
            </button>
            <hr className='my-3' />
          </div>
        </div>
      )}
      {isMobileModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-sm">
                        <p className='text-gray-500 text-sm'>Hola</p>
                        <p className='font-bold text-lg'>{user.name}</p>
                        <hr className='my-3' />
                        <button onClick={GestionarKioscos} className='w-full flex items-center justify-center bg-black-custom text-white py-2 rounded-lg mb-2 hover:bg-gray-700 transition'>
                            <FiSettings className="mr-2" /> Gestionar Kioscos
                        </button>
                        <button onClick={CerrarSesion} className='w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-400 transition'>
                            <FiLogOut className="mr-2" /> Cerrar Sesión
                        </button>
                        <button onClick={() => setIsMobileModalOpen(false)} className='w-full mt-3 bg-gray-300 py-2 rounded-lg hover:bg-gray-400'>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
    </div>
  );
}