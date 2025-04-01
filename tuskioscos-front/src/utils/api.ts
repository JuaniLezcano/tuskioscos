"use client";

export const clientFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(options.headers || {})
  };
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('No autorizado: Token inválido o expirado');
    }
    
    const error = await response.json().catch(() => ({ 
      error: response.statusText 
    }));
    throw new Error(error.error || `Error: ${response.status}`);
  }
  
  return response.json();
};