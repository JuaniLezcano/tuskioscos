import React from 'react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { KioscoItem } from '@/components/kioscoItem';
import { Kiosco, User } from '@/types'
import Header from '@/components/header';

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
            throw new Error('No autorizado: Token inválido o expirado');
        }

        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error al obtener datos del Usuario:', error);
        throw error;
    }
}


export default async function Dashboard() {
    const kioscos: Kiosco[] = await fetchKioscos()
    const kioscosTotal = kioscos.length;
    
    return (
        <>
            <header>
                <Header/>
            </header>
            <div className="p-8">
                <h1 className="text-2xl font-bold text-center mb-4">Número de Kioscos</h1>
                <p className="text-center mb-8">{kioscosTotal}</p>
                {kioscos.map(kiosco => (
                    <KioscoItem key={kiosco.id} kiosco={kiosco} />
                ))}
            </div>
        </>
    );
}
