import { getUser } from "@/app/actions/user";
import Header from "@/components/header";
import KioscosClient from "@/components/kioscosClient";

export default async function KioscosGrid() {
    const user = await getUser(); // Obtener usuario en el servidor

    return (
        <div className="min-h-screen flex flex-col">
            <header>
                <Header user={user} />
            </header>
            <KioscosClient /> {/* Manejamos los kioscos en el cliente */}
        </div>
    );
}
