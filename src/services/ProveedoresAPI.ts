import axios, { isAxiosError } from "axios";
import api from "../lib/axios";
import { proveedorSchema } from "../types";





export async function getProveedores() {
    
    try {
        
        const response = await api('/proveedores')
        const resultado = proveedorSchema.safeParse(response.data)
        
        if (resultado.success) {
            return resultado.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errors);
        }


    }


}


