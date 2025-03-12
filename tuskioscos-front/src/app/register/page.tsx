"use client";
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z.object ({
  email: z.string().min(1, 'El email es requerido').email('Formato de email inválido'),
  name: z.string()
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export default function Register() {
  return (
    <div>Register</div>
  )
}
