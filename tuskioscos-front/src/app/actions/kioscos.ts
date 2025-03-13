"use server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies(); // Obtener cookies dentro de la función
  const tokenCookie = cookieStore.get("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(tokenCookie && { Authorization: `Bearer ${tokenCookie.value}` })
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    headers,
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Error en la API: ${res.statusText}`);
  }

  return res.json();
}

// ✅ Obtener todos los kioscos del usuario autenticado
export async function getKioscos() {
  return fetchAPI("/kioscos");
}

// ✅ Obtener un kiosco por ID
export async function getKiosco(kioscoId: number) {
  return fetchAPI(`/kioscos/${kioscoId}`);
}

// ✅ Crear un nuevo kiosco
export async function createKiosco(name: string) {
  return fetchAPI("/kioscos", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

// ✅ Actualizar un kiosco por ID
export async function updateKiosco(kioscoId: number, name: string) {
  return fetchAPI(`/kioscos/${kioscoId}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
}

// ✅ Eliminar un kiosco por ID
export async function deleteKiosco(kioscoId: number) {
  return fetchAPI(`/kioscos/${kioscoId}`, {
    method: "DELETE",
  });
}
