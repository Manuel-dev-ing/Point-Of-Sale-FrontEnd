import { isAxiosError } from "axios";
import api from "../lib/axios";
import { resumenVentasSchema, topProductsSchema, topUsuariosShema, ventasCategoriasShema } from "../types";

export async function ventasCategorias() {
    
    try {
        
        const response = await api('/reports/ventasCategorias')
        const result = ventasCategoriasShema.safeParse(response.data)
        
        if (result.success) {
            return result.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}


export async function getTopUsuarios() {
    
    try {
        
        const response = await api('/reports/topUsuarios')
        const result = topUsuariosShema.safeParse(response.data)

        if (result.success) {
            return result.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}


export async function getTopProducts() {
    
    try {
        
        const response = await api('/reports/topProducts')
        const result = topProductsSchema.safeParse(response.data)

        if (result.success) {
            return result.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}


export async function getResumenVentas({ queryKey }) {

    try {
        const [_key, { fechaInicio, fechaFin }] = queryKey;
        const response = await api('/reports/resumen', {
            params: {fechaInicio, fechaFin}
        })
        const result = resumenVentasSchema.safeParse(response.data)
        
        if (result.success) {
            return result.data
        }
        

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }

}








