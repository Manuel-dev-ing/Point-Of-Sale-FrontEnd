import { isAxiosError } from "axios";
import api from "../lib/axios";
import { rolsSchema, usersSchema, type User, type UserFormData } from "../types";


export async function getRols() {
    
    try {

        const response = await api('/users/getRols');
       

        const resultado = rolsSchema.safeParse(response.data)

        if (resultado.success) {
            return resultado.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }

}

export async function getUsers() {
    
    try {

        const response = await api('/users');
        const resultado = usersSchema.safeParse(response.data)

        if (resultado.success) {
            return resultado.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }

}

export async function createUser(data: UserFormData) {
    
    try {
        const payload = {...data, idRol: Number(data.idRol)}

        const response = await api.post('/users', payload);
        console.log(response);
      

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }

}

export async function deleteUser(id: number) {
    
    try {
        console.log(id);
        
        const response = await api.delete(`/users/${id}`);
        console.log(response);
      

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }

}


export async function updateUser(data: User) {
    
    try {
        console.log(data);

        const response = await api.put(`/users/${data.id}`, data);
        console.log(response);
      

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
            
        }
    }

}


