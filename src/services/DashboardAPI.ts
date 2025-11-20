import { isAxiosError } from "axios";
import api from "../lib/axios";
import { productShema, resumeDashboardShema } from "../types";

// week_start: 
// ReportsView.tsx:59 2025-11-16
// ReportsView.tsx:60 week_end: 
// ReportsView.tsx:61 2025-11-22

export async function getResumeDashboard() {
    
    try {
        const response = await api('/dashboard');
        const resultado = resumeDashboardShema.safeParse(response.data)
        if (resultado.success) {
            return resultado.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }
}

export async function getLowStockProduts() {
    
    try {
        const response = await api('/dashboard/GetLowStockProducts');
        const resultado = productShema.safeParse(response.data)

        if (resultado.success) {
            return resultado.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }
}


