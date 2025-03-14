"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { CierreCaja } from "../../types"; // Ajusta la ruta según donde tengas tus tipos definidos
import { logout } from "./user";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Función base para realizar peticiones a la API
 */
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
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
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    if (res.status === 401 || res.status === 403) {
      // Token inválido o no autorizado
      await logout();
      throw new Error("Token inválido o no autorizado. Se ha cerrado la sesión.");
    }
    throw new Error(errorData.error || `Error en la API: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Obtiene todos los cierres de caja de un kiosco
 */
export async function getAllCierreCaja(kioscoId: number): Promise<CierreCaja[]> {
  try {
    return await fetchAPI(`/cierreCaja/${kioscoId}`);
  } catch (error) {
    console.error("Error al obtener cierres de caja:", error);
    throw new Error("No se pudieron obtener los cierres de caja");
  }
}

/**
 * Obtiene un cierre de caja específico
 */
export async function getCierreCaja(kioscoId: number, cierreCajaId: number): Promise<CierreCaja> {
  try {
    return await fetchAPI(`/cierreCaja/${kioscoId}/${cierreCajaId}`);
  } catch (error) {
    console.error("Error al obtener cierre de caja:", error);
    throw new Error("No se pudo obtener el cierre de caja");
  }
}

/**
 * Crea un nuevo cierre de caja
 */
export async function createCierreCaja(kioscoId: number, formData: FormData): Promise<CierreCaja> {
  try {
    const monto = formData.get("monto") as string;
    const fecha = formData.get("fecha") as string;

    if (!monto || isNaN(parseFloat(monto)) || parseFloat(monto) < 0) {
      throw new Error("Monto inválido");
    }

    const response = await fetchAPI(`/cierreCaja/${kioscoId}`, {
      method: "POST",
      body: JSON.stringify({
        monto: parseFloat(monto),
        fecha,
      }),
    });
    
    revalidatePath(`/kioscos/${kioscoId}/cierres`);
    return response;
  } catch (error) {
    console.error("Error al crear cierre de caja:", error);
    throw new Error(error instanceof Error ? error.message : "No se pudo crear el cierre de caja");
  }
}

/**
 * Actualiza un cierre de caja existente
 */
export async function updateCierreCaja(kioscoId: number, cierreCajaId: number, formData: FormData): Promise<CierreCaja> {
  try {
    const monto = formData.get("monto") as string;

    if (!monto || isNaN(parseFloat(monto)) || parseFloat(monto) < 0) {
      throw new Error("Monto inválido");
    }

    const response = await fetchAPI(`/cierreCaja/${kioscoId}/${cierreCajaId}`, {
      method: "PUT",
      body: JSON.stringify({
        monto: parseFloat(monto),
      }),
    });
    
    revalidatePath(`/kioscos/${kioscoId}/cierres`);
    revalidatePath(`/kioscos/${kioscoId}/cierres/${cierreCajaId}`);
    return response;
  } catch (error) {
    console.error("Error al actualizar cierre de caja:", error);
    throw new Error("No se pudo actualizar el cierre de caja");
  }
}

/**
 * Elimina un cierre de caja
 */
export async function deleteCierreCaja(kioscoId: number, cierreCajaId: number): Promise<CierreCaja> {
  try {
    const response = await fetchAPI(`/cierreCaja/${kioscoId}/${cierreCajaId}`, {
      method: "DELETE",
    });
    
    revalidatePath(`/kioscos/${kioscoId}/cierres`);
    return response;
  } catch (error) {
    console.error("Error al eliminar cierre de caja:", error);
    throw new Error("No se pudo eliminar el cierre de caja");
  }
}