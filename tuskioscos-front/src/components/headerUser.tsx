"use client"
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import React from 'react';

interface UserMenuProps {
    name: string;
}

export function HeaderUser({ name }: UserMenuProps) {
    const router = useRouter(); 

    function GestionarKioscos(){
        router.push("/dashboard/kioscos")
    }

    async function CerrarSesion() { 
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.error || `Error ${response.status}`);
            }

            router.push("/login"); 
        } catch (error: any) {
            console.log("Error en fetchData:", error.message);
        }
    }
    return (
        <div className='absolute top-4 right-0 bg-white shadow-lg rounded-lg p-5 w-44 sm:w-48 md:w-56 lg:w-64'>
            <p className='text-gray-500 text-sm'>Hola</p>
            <p className='font-bold text-lg'>{name}</p>
            <hr className='my-3' />
            <button
                onClick={GestionarKioscos}
                className='w-full bg-gray-800 text-white py-2 rounded-lg mb-2 hover:bg-gray-700'>
                Gestionar Kioscos
            </button>
            <button
                onClick={CerrarSesion}
                className='w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-400'>
                Cerrar Sesión
            </button>
            <hr className='my-3' />
        </div>
    );
};


