import { isAxiosError } from "axios";
import api from "../lib/axios";
import type { Compra } from "../types";


export async function createCompra(compra : Compra) {

    try {
        
        await api.post('/compras', compra) 

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errors);
            
        }
    }


}




