"use client"
import { clientFetch } from "@/utils/api";
import Header from "@/components/header";
import KioscosClient from "@/components/kioscosClient";
import { useEffect, useState } from "react";

export default function KioscosGrid() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const userData = await clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`);
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []); // Obtener usuario en el servidor
    
    if (loading) {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
              <p className="text-gray-500">Cargando...</p>
            </div>
          </div>
        );
      }
    return (
        <div className="min-h-screen flex flex-col">
            <header>
                {loading ? (
                    // You can add a loading indicator here if needed
                    <div>Loading...</div>
                ) : (
                    user && <Header user={user} />
                )}
            </header>
            <KioscosClient /> {/* Manejamos los kioscos en el cliente */}
        </div>
    );
}
