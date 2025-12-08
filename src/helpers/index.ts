import { addMonth, format, monthStart, weekEnd, weekStart, yearEnd, yearStart } from "@formkit/tempo";
import {jwtDecode} from "jwt-decode";
import { usePosNetStore } from "../store";
import type { AuthUser, ResumenVenta } from "../types";


export const isAdmin = (user: AuthUser) => {
  const roles = ["Cajero/Vendedor", "Administrador"]

  const isAdmin = roles.every(x => user.roles?.some(r => r.nombre === x))

  return isAdmin;
}

export const getMonths = (data : ResumenVenta[]) => {
  let arr_months : string[] = []        
  data.map((item, index) => {
    const date = format(item.fecha, "MM", "es") 
    if (!arr_months.includes(date)) {
        arr_months.push(date)
    }
  })

  return arr_months;
}

export const formatSalesResume = (data : ResumenVenta[], arr : string[]) => {
  let arr_salesResume : ResumenVenta[] = []
  let ingresos: number = 0
  let ventas: number = 0
  let fecha: string = ''

  arr.forEach(element => {
    const result = data.filter(x => format(x.fecha, "MM", "es").includes(element))
    
    result.forEach(item => {
      ingresos += item.ingresos
      ventas += item.ventas
    });
      
    // console.log({ingresos, ventas, fecha: format(result[0].fecha, "MMM", "es")  });
    const total = (calcularIVA(ingresos) + ingresos).toFixed(2)
    const sales = ventas.toFixed(2) 
    let obj = {ingresos: Number(total), ventas: Number(sales), fecha: format(result[0].fecha, "MMM", "es")  }
    arr_salesResume.push(obj)

  });

  return arr_salesResume  
}

export function establecerPeriodo(tipoPeriodos: string) {
  
  const setPeriodo = usePosNetStore((state) => state.setPeriodo)
  
  const setFechaInicio = usePosNetStore((state) => state.setFechaInicio)
  
  const setFechaFin = usePosNetStore((state) => state.setFechaFin)

  switch (tipoPeriodos) {
    case 'semana':
    
      let week_start = format(weekStart(new Date()), "YYYY-MM-DD", "en")
      let week_end = format(weekEnd(new Date()), "YYYY-MM-DD", "en") 
      console.log("week_start: ");
      console.log(week_start);
      console.log("week_end: ");
      console.log(week_end);

      setPeriodo('semana')
      setFechaInicio(week_start)
      setFechaFin(week_end)

      break;

    case 'mes':
      let month_start = format(yearStart(new Date()), "YYYY-MM-DD", "en")

      let month_end = format(yearEnd(new Date()), "YYYY-MM-DD", "en")
      setPeriodo('mes')
      setFechaInicio(month_start)
      setFechaFin(month_end)
      
      break;
    case 'trimestre':
      let startTrim = format(addMonth(new Date(), -3), "YYYY-MM-DD", "en");
      let lastTrim = format(monthStart(new Date()), "YYYY-MM-DD", "en")
      setPeriodo('trimestre')
      setFechaInicio(startTrim)
      setFechaFin(lastTrim)

      break;
    case 'anio':
      let year_start = format(yearStart(new Date()), "YYYY-MM-DD", "en")

      let year_end = format(yearEnd(new Date()), "YYYY-MM-DD", "en") 
      setFechaInicio(year_start)
      setFechaFin(year_end)
      setPeriodo('anio')
      break;

    default:
      break;
  }


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



