"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Formato de email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

type LoginFormData = {
  email: string;
  password: string;
};

async function fetchData(data: LoginFormData) {
  console.log("Realizando fetch con:", JSON.stringify(data, null, 2));

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    console.log("Estado del response:", response.status); // Verifica si se llega a esta línea

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en fetchData:", error.message);
    throw error; // Relanza el error para que lo maneje onSubmit
  }
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Enviando datos:", data);
      const response = await fetchData(data);
      console.log('Respuesta del servidor:', response);
    } catch (error) {
      console.error('Error al hacer login:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          {...register('email')}
          className="w-full p-2 border rounded-lg"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Contraseña</label>
        <input
          type="password"
          {...register('password')}
          className="w-full p-2 border rounded-lg"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
        Iniciar sesión
      </button>
    </form>
  );
}