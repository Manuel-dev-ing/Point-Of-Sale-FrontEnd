import { isAxiosError } from "axios";
import api from "../lib/axios";
import { clientsShema, type ClientFormData, type Clients } from "../types";
import { da } from "zod/v4/locales";



export async function getClients() {
    
    try {
        const response = await api('/clients');
        const resultado = clientsShema.safeParse(response.data)

        if (resultado.success) {
            return resultado.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }
}

export async function getAllClients() {
    
    try {
        const response = await api('/clients/getAllClients');
        const resultado = clientsShema.safeParse(response.data)
       

        if (resultado.success) {
            return resultado.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }
}

export async function createClent(formData : ClientFormData) {
    try {
        const response = await api.post('/clients', formData);
        console.log(response);

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }
}

export async function deleteClient(id : number) {
    
    try {
    
        const response = await api.delete(`/clients/${id}`);
        console.log(response);

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }
}


export async function editClient(data : Clients) {
    
    try {
        
        const response = await api.put(`/clients/${data.id}`, data)
        console.log(response);
        

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }


}

