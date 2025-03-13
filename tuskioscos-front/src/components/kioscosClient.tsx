"use client";

import { useEffect, useState } from "react";
import { getKioscos, createKiosco, deleteKiosco } from "@/app/actions/kioscos";

function KioscoCard({ kiosco, onDelete }: { kiosco: any; onDelete: (id: number) => void }) {
    return (
        <div className="border rounded-lg p-4 flex items-center justify-between shadow-sm">
            <span>{kiosco.name}</span>
            <div className="flex gap-2">
                <button className="p-2" onClick={() => alert("Editar no implementado aún")}>✏️</button>
                <button className="p-2" onClick={() => onDelete(kiosco.id)}>🗑️</button>
            </div>
        </div>
    );
}

export default function KioscosClient() {
    const [kioscos, setKioscos] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getKioscos();
                setKioscos(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    async function handleAddKiosco() {
        try {
            await createKiosco("Nuevo Kiosco");
            alert("Kiosco agregado!");
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteKiosco(kioscoId: number) {
        try {
            await deleteKiosco(kioscoId);
            alert("Kiosco eliminado!");
            setKioscos((prev) => prev.filter((k) => k.id !== kioscoId));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <button className="mt-2 p-2 bg-blue-500 text-white rounded" onClick={handleAddKiosco}>+</button>
            <div className="grid grid-cols-3 gap-4 mt-4">
                {kioscos.map((kiosco: any) => (
                    <KioscoCard key={kiosco.id} kiosco={kiosco} onDelete={handleDeleteKiosco} />
                ))}
            </div>
        </>
    );
}
