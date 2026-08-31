import { isAxiosError } from "axios";
import api from "../lib/axios";
import { settingsCompany, type ConfigEmpresa, type ConfigEmpresaFormData } from "../types";


export async function getConfigCompany() {
    
    try {

        const response = await api.get(`/configempresa/firstElement`);
        const result = settingsCompany.safeParse(response.data)
        
        console.log(result);

        if (result.success) {
            return result.data
        }

    } catch (error) {

        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    
    }

}


export async function createConfigCompany(data : ConfigEmpresaFormData) {
    
    try {
        const response = await api.post(`/configempresa`, data);
        // console.log(response);
     

    } catch (error) {

        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    
    }

}


export async function editConfigCompany(data : ConfigEmpresa) {
    

    try {
        console.log(data);
            
        const response = await api.put(`/configempresa/${data.id}`, data)
        console.log(response);

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }

}





