"use client";
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z.object ({
  email: z.string().min(1, 'El email es requerido').email('Formato de email inválido'),
  name: z.string(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

type RegisterFormData = {
  email: string;
  name: string;
  password: string;
};

async function fetchData(data: RegisterFormData) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || `Error ${response.status}`);    
    }

    return responseData;
  } catch (error: any) {
    console.log("Error en fetchData:", error.message);
    throw error; 
  }
}

export default function Register() {
  return (
    <div>Register</div>
  )
}
