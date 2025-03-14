import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-black-custom mb-4">tus kioscos</h1>
      <p className="text-lg text-black-custom mb-16 text-center">Aplicación para gestionar los ingresos diarios de tus negocios y tomar mediciones en base a ello</p>
      <div className="flex gap-6">
        <Link href="/login" className="bg-gray-custom text-black-custom px-8 py-3 rounded-lg border border-black-custom text-lg font-medium hover:bg-black-custom hover:text-gray-custom transition">
          Iniciar sesión
        </Link>
        <Link href="/register" className="bg-black-custom text-gray-custom px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-custom hover:text-black-custom border border-black-custom transition">
          Registrarse
        </Link>
      </div>
    </div>
  );
}