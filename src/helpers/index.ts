import {jwtDecode} from "jwt-decode";



export function calcularResta(total: number, recibe: number) : number{
    let resultado = (recibe - total)

    return resultado
}



export function calcularIVA(numero:number) : number {
    
    const iva : number = 16

    const resultado = (numero * iva)

    let total_iva = resultado / 100

    return total_iva
}

export function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeJwt(token);
  if (!decoded) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}



