import { cookies } from "next/headers";  // Trae la cookie en el servidor
import Link from "next/link";

export default async function Home() {
  // Verifica la cookie en el servidor
  const token = (await cookies()).get("token")?.value;

  return (
    <div>
      <header>
        <h1>Bienvenido a nuestra plataforma</h1>
        {!token && (
          <div>
            <Link href="/login">Iniciar sesión</Link> / <Link href="/register">Registrar</Link>
          </div>
        )}
      </header>

      {/* Si el usuario tiene el token, muestra el Dashboard */}
      {token ? (
        <div>
          <h2>Bienvenido al Dashboard</h2>
          <p>Contenido exclusivo para usuarios autenticados</p>
        </div>
      ) : (
        <div>
          <h2>Bienvenido a nuestra página</h2>
          <p>Para aprovechar todas las funcionalidades, por favor inicie sesión o regístrese.</p>
        </div>
      )}
    </div>
  );
}