'use client'
import Image from "next/image";
import HeaderLogged from "@/components/Header/headerLogged";
import HeaderUnlogged from "@/components/Header/headerUnlogged";
import { useState } from "react";

export default function Home() {
  // Estado para manejar si el usuario está logueado
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      {isLoggedIn ? <HeaderLogged /> : <HeaderUnlogged />}
    </div>
  );
}