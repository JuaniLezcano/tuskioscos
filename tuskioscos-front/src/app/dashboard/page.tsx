import React from 'react'
import { cookies } from 'next/headers'
import { KioscoItem } from '@/components/kioscoItem';
import { Kiosco, User } from '@/types'
import Header from '@/components/header';
import { redirect } from "next/navigation";

async function fetchKioscos(): Promise<Kiosco[]> {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    
    if (!tokenCookie?.value) {
        throw new Error('No se encontró el token de autenticación');
    }
    
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/kioscos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenCookie.value}`,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        })

        if (response.status === 401) {
            redirect("/");
            throw new Error('No autorizado: Token inválido o expirado');
            
        }

        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error al obtener kioscos:', error);
        throw error;
    }
}

async function fetchUserInfo(): Promise<User> {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');

    if (!tokenCookie?.value) {
        throw new Error('No se encontró el token de autenticación');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenCookie.value}`,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        })

        if (response.status === 401) {
            redirect("/");
        }

        if (!response.ok) {
            redirect("/");
        }

        return response.json();
    } catch (error) {
        console.error('Error al obtener datos del Usuario:', error);
        throw error;
    }
}


export default async function Dashboard() {
    const user: User = await fetchUserInfo()
    const kioscos: Kiosco[] = await fetchKioscos()
    const kioscosTotal = kioscos.length;
    
    return (
        <div className='min-h-screen flex flex-col'>
            <header>
                <Header 
                    user={user}
                />
            </header>
            <div className='flex-1 flex items-center justify-center'>
                <div className='w-full max-w-4xl'>
                    <div className="text-center">
                        <h1 className="text-2xl font-medium mb-4">Número de Kioscos</h1>
                        <p className="text-xl font-bold text-gray-900">{kioscosTotal}</p>
                    </div>
                    <div className='my-10'>
                        {kioscos.map(kiosco => (
                            <KioscoItem key={kiosco.id} kiosco={kiosco} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
