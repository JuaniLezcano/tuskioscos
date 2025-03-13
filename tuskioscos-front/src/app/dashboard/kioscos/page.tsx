import { getUser } from "@/app/actions/user";
import Header from "@/components/header";
import KioscosClient from "@/components/kioscosClient";

export default async function KioscosGrid() {
    const user = await getUser(); // Obtener usuario en el servidor

    return (
        <div className="p-4">
            <Header user={user} />
            <h2 className="text-xl font-semibold">Kioscos</h2>
            <p className="text-sm text-gray-600">Alta, baja y modificación</p>
            <KioscosClient /> {/* Manejamos los kioscos en el cliente */}
        </div>
    );
}
