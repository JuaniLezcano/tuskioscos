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

export async function login(email: string, password: string){
  return fetchAPI("/user/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, name: string, password: string){
  return fetchAPI("/user/register", {
    method: "POST",
    body: JSON.stringify({ email, name, password }),
  });
}

export async function getUser() {
  return fetchAPI("/user");
}

export async function logout(){
  return fetchAPI("/user/logout", {
    method: "POST"
  });
}