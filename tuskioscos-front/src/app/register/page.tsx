"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { register as registerUser } from "@/app/actions/user";

const registerSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Formato de email inválido"),
  name: z.string().min(1, "El nombre es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type RegisterFormData = {
  email: string;
  name: string;
  password: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);
      const response = await registerUser(data.email, data.name, data.password);
      if (response) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error al registrar:", error.message);
        setServerError("Hubo un error al intentar registrarte. Por favor, inténtalo de nuevo.");
      } else {
        setServerError("Error desconocido");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg w-full mx-auto p-4 border rounded-lg shadow-lg">
        <div>
          <label className="block text-md font-medium pb-2">Nombre</label>
          <input type="text" {...register("name")} className="w-full p-2 border rounded-lg" />
          {errors.name && <p className="text-red-500 text-md">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-md font-medium pb-2">Email</label>
          <input type="email" {...register("email")} className="w-full p-2 border rounded-lg" />
          {errors.email && <p className="text-red-500 text-md">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-md font-medium pb-2">Contraseña</label>
          <input type="password" {...register("password")} className="w-full p-2 border rounded-lg" />
          {errors.password && <p className="text-red-500 text-md">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-black-custom text-white p-2 rounded-lg hover:bg-gray-950">
          Registrarse
        </button>

        {serverError && <p className="text-red-500 text-md text-center">{serverError}</p>}
      </form>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Cuenta creada satisfactoriamente</h2>
            <p className="text-gray-700 mb-4">Ahora puedes iniciar sesión.</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/login");
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
