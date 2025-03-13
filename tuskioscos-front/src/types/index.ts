export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  kioscos: Kiosco[];
}

export interface Kiosco {
  id: number;
  name: string;
  userId: number;
  user: User;
  cierreCaja: CierreCaja[];
}

export interface CierreCaja {
  id: number;
  fecha: Date;
  monto: number;
  kioscoId: number;
  kiosco: Kiosco;
}