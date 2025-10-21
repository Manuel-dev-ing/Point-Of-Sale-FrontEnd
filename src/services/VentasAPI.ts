import { isAxiosError } from "axios";
import type { Venta } from "../types";
import api from "../lib/axios";


export async function create_venta(venta : Venta) {
    console.log(venta);

    try {
        const response = await api.post('/ventas', venta)
        console.log(response);
    } catch (error) {
        if (isAxiosError(error) && error.response ) {
            throw new Error(error.response.data.errors);
        }
    }
}








