import { addMonth, format, monthStart, weekEnd, weekStart, yearEnd, yearStart } from "@formkit/tempo";
import {jwtDecode} from "jwt-decode";
import { usePosNetStore } from "../store";
import type { AuthUser, ResumenVenta } from "../types";
import { array, object } from "zod";

export const numeroVenta = () => {
  const venta : number = 123

  let numero = venta === 0 ? venta + 1 : venta
  let venta_numero = numero.toString() 
  let result
  
  let arr = ['0', '0', '0', '0', '0','0', '0', '0','0']
  let last_position = (arr.length - 1)
  
  if (arr.length < venta_numero.length) {
    let diference = ((venta_numero.length - arr.length) + '1' ).toString()
    
    for (let index = 0; index < diference.length; index++) {
      arr.unshift("0")
      
    }

    last_position = (arr.length-1)
  }

  if (arr.length >= venta_numero.length) {
    
    for (let i = 0; i < venta_numero.length; i++) {
      arr[(last_position-(venta_numero.length - 1)) + i] = venta_numero[i]
      
    }
    
    result = "VTA-"+arr.join("")
    
  }

  return result

}


export const isAdmin = (user: AuthUser) => {
  const roles = ["Cajero/Vendedor", "Administrador"]

  // console.log(user.roles?.some(r => r.nombre === "Administrador"));
  const isAdmin = roles.every(x => user.roles?.some(r => r.nombre === x))
  
  return isAdmin;
}


export const formatSalesResume = (data : ResumenVenta[]) => {
  
  const newdata = data.map(item => {
    return {...item, fecha: format(item.fecha, "MMM", "es")}
  })  
  

  return newdata;  
}



export function calcularResta(total: number, recibe: number) : number {
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



