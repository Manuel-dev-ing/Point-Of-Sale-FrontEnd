import axios, { isAxiosError } from "axios";
import api from "../lib/axios";
import { proveedor, proveedorSchema } from "../types";





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



export async function getProveedorById(id:number) {
    
    try {
        
        const response = await api(`/proveedores/${id}`)
        console.log(response);
        
        // const resultado = proveedorSchema.safeParse(response.data)
        // console.log(resultado);
        
        if (response.status === 200) {
            return response.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errors);
        }


    }


}


