import { isAxiosError } from "axios";
import api from "../lib/axios";
import { movimientosShema, type MovimientoFormData } from "../types";


export async function getMovements() {
    
    try {

        const response = await api('/inventory')
        const result = movimientosShema.safeParse(response.data)
      
        if (result.success) {
            return result.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errors);
            
        }
    }


}


export async function createMovement(data : MovimientoFormData) {
    
    try {
        console.log("data create movement...");
        console.log(data);

        await api.post('/inventory', data)

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errors);
            
        }
    }


}







