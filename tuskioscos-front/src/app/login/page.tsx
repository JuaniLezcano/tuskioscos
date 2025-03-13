"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Formato de email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

type LoginFormData = {
  email: string;
  password: string;
};

async function fetchData(data: LoginFormData) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`, {
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

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null);
      console.log("Enviando datos:", data);
      const response = await fetchData(data);
      if (response){
        router.push("/dashboard")
      }
    } catch (error) {
        if (error instanceof Error) {
          console.log('Error al hacer login:', error.message);
    
          // Si las credenciales son incorrectas
          if (error.message.includes("Invalid credentials")) {
            setError("password", { type: "manual", message: "Email o contraseña incorrectos" });
          } else {
            setServerError("Hubo un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.");
          }
        } else {
          setServerError("Error desconocido");
        }
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg w-full mx-auto p-4 border rounded-lg shadow-lg">
        <div>
          <label className="block text-md font-medium pb-2">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full p-2 border rounded-lg"
          />
          {errors.email && <p className="text-red-500 text-md">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-md font-medium pb-2">Contraseña</label>
          <input
            type="password"
            {...register('password')}
            className="w-full p-2 border rounded-lg"
          />
          {errors.password && <p className="text-red-500 text-md mt-4">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-black-custom text-white p-2 rounded-lg hover:bg-gray-950">
          Iniciar sesión
        </button>

        {serverError && (
          <p className="text-red-500 text-md text-center">{serverError}</p>
        )}
      </form>
    </div>
  );
}