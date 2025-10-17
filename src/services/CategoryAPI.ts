import { isAxiosError } from "axios";
import api from "../lib/axios";
import { categoriesShema, type Category, type CategoryFormData } from "../types";


 
export async function getCategories() {
    
    try {
        const response = await api('/categories');
        const resultado = categoriesShema.safeParse(response.data)

        if (resultado.success) {
            return resultado.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }
}


export async function createCategory(data : CategoryFormData) {
    
    try {
        const response = await api.post(`/categories`, data);
        console.log(response);
        

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }

}

export async function deleteCategories(id:number) {
    try {
        await api.delete(`/categories/${id}`);

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }
}

export async function updateCategory(data:Category) {
    try {
        console.log("updateCategory");
        console.log(data);
        
        const { id, nombre, descripcion } = data

        const resultado = await api.put(`/categories/${id}`, {id, nombre, descripcion});
        console.log(resultado);
        

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }
}







