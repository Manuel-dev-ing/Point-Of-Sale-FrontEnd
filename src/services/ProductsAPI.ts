import { isAxiosError } from "axios";
import api from "../lib/axios";
import { product, productsShema, type Product, type ProductData, type ProductFormData } from "../types";
import { da } from "zod/v4/locales";
import { usePosNetStore } from "../store";



export async function getProducts() {

    try {
        
        const response = await api('/products')
        const result = productsShema.safeParse(response.data)

        if (result.success) {
            return result.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }

}

export async function getAllProducts() {
    
    try {
        
        const response = await api('/products/getAllProducts')
        const result = productsShema.safeParse(response.data)

        if (result.success) {
            return result.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }

}


export async function createProduct(data:ProductFormData) {
    
    try {
        
        const response = await api.post('/products', data)
        console.log(response);
        

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }

}

export async function deleteProduct(id:number) {
    try {
        
        const response = await api.delete(`/products/${id}`)
        console.log(response);

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }

}

export async function getProductId(id : number) {
    try {
        const response = await api(`/products/${id}`)
        const result = product.safeParse(response.data)
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


export async function updateProduct(data:ProductData) {
    
    try {
        console.log(data);
                
        const response = await api.put(`/products/${data.id}`, data)
        console.log(response);

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }


}


