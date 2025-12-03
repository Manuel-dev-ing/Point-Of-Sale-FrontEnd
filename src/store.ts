import { json } from "zod"
import { authLoginSchema, authUserSchema, type Alerta, type AuthUser, type Categories, type Category, type Clients, type ComprasData, type LoginFormData, type Product, type SaleData, type User } from "./types"
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import axios from "axios"
import api from "./lib/axios"
import Spinner from "./components/Spinner"

type PosNetStore = {
    data: Category | Clients | Product | {} | User
    set: (formData: Category | Clients | Product | User) => void
    activeId: number
    reset: () => void
    //ventas
    dataVenta: SaleData[] 
    //Compras
    dataCompras: ComprasData[]
    //ventas productos pendientes
    dataPendingProducts: SaleData[]
    //auth user data
    dataAuthProfileUser: AuthUser | {}

    //modal
    isOpen: boolean
    setIsOpen: (open : boolean) => void
    //ventas
    setDataVenta: (formData: SaleData) => Alerta
    clearDataVenta: (name: string) => void
    actualizarCantidad: (Data: SaleData[] | ComprasData[], name : string) => void
    eliminarProducto: (id : number, name : string) => Alerta
    elimanarProductos: (ids : number[]) => Alerta
    setPendingProducts: (ids : number[]) => Alerta
    //state para guardar los elementos seleccionados
    dataProductsSelected: number[]
    setProductsSelected: (ids : number[]) => void
    changeProducts: (Data: SaleData[]) => void
    //funciones compras
    setDataCompra: (formData: ComprasData) => Alerta
    //Login
    fetchLogin: (formData : LoginFormData) => Alerta
    //auth user
    fetchAuthData: (email : string) => void

}

const authData = () => {
    const data = localStorage.getItem("auth_data")
    const auth_data : AuthUser = data ? JSON.parse(data) as AuthUser : {} as AuthUser

    return auth_data;
}


const productsSale = () => {
    const productos = localStorage.getItem('productos')
    const arr_products : SaleData[] = productos ? JSON.parse(productos) : [] 
    return arr_products
}

const productsCompras = () => {
    const productos = localStorage.getItem('productosCompras')
    const arr_products : ComprasData[] = productos ? JSON.parse(productos) : [] 
    return arr_products
}

const pendingProducts = () => {
    const productos = localStorage.getItem('pendingProducts')
    const arr_products : SaleData[] = productos ? JSON.parse(productos) : [] 
    return arr_products
}

export const usePosNetStore = create<PosNetStore>()(devtools((set, get) => ({
    dataCompras: productsCompras(),
    dataVenta: productsSale(),
    dataPendingProducts: pendingProducts(),
    data: {},
    
    dataProductsSelected: [],
    dataAuthProfileUser: authData(),
    set: (formData) =>{
        const { id } = formData

        set(() => ({
            data: formData,
            activeId: id

        }))
    },
    reset: () => {
        set(() => ({
            data: {},
            activeId: 0

        }))

    },
    //Ventas
    setDataVenta: (formData) => {
        if (formData) {
            const result = get().dataVenta.findIndex(item => item.idProducto === formData.idProducto)

            if (result >= 0) {
                console.log("El producto ya existe");
                
                const result = get().dataVenta.map(item => {
                    console.log(item);
                    if (item.idProducto === formData.idProducto) {
                        item.cantidad += 1 
                    }
                    return item
                });
                
                console.log(result);
                set(() => ({

                    dataVenta: result
                }))

                const products = get().dataVenta
                localStorage.setItem('productos', JSON.stringify(products))
                return { isSuccess: true, mensaje: `se actualizo la cantidad` }
                
            } else {
                
                set(() => ({
    
                    dataVenta: [...get().dataVenta, formData]
    
                }))
                const products = get().dataVenta
                localStorage.setItem('productos', JSON.stringify(products))
                console.log("Producto");
                return { isSuccess: true, mensaje: `${formData.producto} se añadio correctamente` }
    
            }

        }


    },
    clearDataVenta: (name) => {
        
        switch (name) {
            case 'shooping':
                set(() => ({
                    dataCompras: []
                }))
        
                localStorage.removeItem('productosCompras')    

                break;
            case 'sales':
                set(() => ({
                    dataVenta: []
                }))
        
                localStorage.removeItem('productos')
                
                break;    
        
            default:
                break;
        }


    },
    actualizarCantidad: (formData, name) => {
        if (formData && name) {
            
            switch (name) {
                case 'shooping':
                    console.log("actualizando cantidad en compras...");
                    
                    set(() => ({
                        dataCompras: formData as ComprasData[]
                    }))

                    const productsCompra = get().dataCompras
                    localStorage.setItem('productosCompras', JSON.stringify(productsCompra))    

                    break;
                case 'sales':
                    console.log("actualizando cantidad en ventas...");

                    set(() => ({
                        dataVenta: formData as SaleData[]
                    }))

                    const productsVenta = get().dataVenta
                    localStorage.setItem('productos', JSON.stringify(productsVenta))
                    break;
                default:
                    break;
            }

            
        }
    },
    eliminarProducto: (id, name) => {
    
        switch (name) {

            case 'shooping':
                const result = get().dataCompras.filter(x => x.idProducto != id);    
                if (result) {
                    set(() => ({
                        dataCompras: result
                    }))

                    const products = get().dataCompras
                    localStorage.setItem('productosCompras', JSON.stringify(products))
                    return { isSuccess: true, mensaje: `producto eliminado` }
                
                }

                break;
            case 'sales':
                 const resultado = get().dataVenta.filter(x => x.idProducto != id);    
                if (resultado) {
                    set(() => ({
                        dataVenta: resultado
                    }))

                    const products = get().dataVenta
                    localStorage.setItem('productos', JSON.stringify(products))
                    return { isSuccess: true, mensaje: `producto eliminado` }
                
                }
                break;
            default:
                return { isSuccess: true, mensaje: `error al elimanar el producto` }
        }
       
    },
    elimanarProductos: (ids) => {
        const elementos_eliminar:SaleData[] = []

        ids.forEach((x, index) => {
            const result = get().dataVenta.find(item => item.idProducto === x)
            if (result) {
                elementos_eliminar[index] = result
            }

        })
        
        let copy_dataVenta = [...get().dataVenta]
        // const save_arr: SaleData[] = []
        console.log("elementos a eliminar: ");
        console.log(elementos_eliminar);
        

        elementos_eliminar.forEach((element, index) => {
            copy_dataVenta = copy_dataVenta.filter(x => x.idProducto !== element.idProducto)
        });

        set(() => ({

            dataVenta: copy_dataVenta

        }))

        const products = get().dataVenta
        localStorage.setItem('productos', JSON.stringify(products))
        console.log(products);
        return { isSuccess: true, mensaje: `productos eliminados` }
    },
    setPendingProducts: (ids) => {

        const elementos_guardar:SaleData[] = []
        let copy_dataVenta = [...get().dataVenta]

        ids.forEach((x, index) => {
            const result = get().dataVenta.find(item => item.idProducto === x)
            if (result) {
                elementos_guardar[index] = result
            }
        })

        set(() => ({

            dataPendingProducts: elementos_guardar

        }))
        const products = get().dataPendingProducts
        localStorage.setItem('pendingProducts', JSON.stringify(products))

        elementos_guardar.forEach((element, index) => {
            copy_dataVenta = copy_dataVenta.filter(x => x.idProducto !== element.idProducto)
        });

        set(() => ({

            dataVenta: copy_dataVenta

        }))
        
        const dataproducts = get().dataVenta
        localStorage.setItem('productos', JSON.stringify(dataproducts))

    },
    setIsOpen: (open) => {
        set(() => ({
            isOpen: open
        }))
    },
    setProductsSelected: (ids) => {
        console.log(ids);
        
        if (ids.length > 0) {
            set(() => ({
                dataProductsSelected: ids
            }))
        }
    },
    changeProducts: (data) => {
        
        let copy_dataVenta = [...get().dataVenta]
        let products_selected = [...get().dataProductsSelected]
        const elementos : SaleData[] = []
        if (products_selected.length > 0) {
             //obtener elementos del state data venta
            products_selected.forEach((x, index) => {
                const result = get().dataVenta.find(item => item.idProducto === x)
                if (result) {
                    elementos[index] = result
                }
            })

            //sacar del state de data venta
            elementos.forEach((element, index) => {
                copy_dataVenta = copy_dataVenta.filter(x => x.idProducto !== element.idProducto)
            });

            data.forEach(x => {
                copy_dataVenta.push(x)
            })

            set(() => ({

                dataVenta: copy_dataVenta

            }))
            
            const dataproducts = get().dataVenta
            localStorage.setItem('productos', JSON.stringify(dataproducts))
        }
        

    },
    //Compras
    setDataCompra: (formData) => {
        
        if (formData) {
            const result = get().dataCompras.findIndex(item => item.idProducto === formData.idProducto)
            if (result > 0) {
                
                console.log("El producto ya existe");
                
                const result = get().dataCompras.map(item => {
                    console.log(item);
                    if (item.idProducto === formData.idProducto) {
                        item.cantidad += 1 
                    }
                    return item
                });
                
                console.log(result);
                set(() => ({

                    dataCompras: result
                }))

                const products = get().dataCompras
                localStorage.setItem('productosCompras', JSON.stringify(products))
                return { isSuccess: true, mensaje: `se actualizo la cantidad` }

            }else{
                set(() => ({
    
                    dataCompras: [...get().dataCompras, formData]
    
                }))
                const products = get().dataCompras
                localStorage.setItem('productosCompras', JSON.stringify(products))
       
                return { isSuccess: true, mensaje: `${formData.producto} se añadio correctamente` }
            }

        }
    },
    fetchLogin: async (formData) => {
        try {
            const response = await api.post(`/auth/login`, formData);
            const result = authLoginSchema.safeParse(response.data)
            if (result.success) {
                localStorage.setItem("accessToken", result.data.token);
                await get().fetchAuthData(formData.email)
              
                return { isSuccess: true, mensaje: `authenticado` }
            
            }else{
                return { isSuccess: false, mensaje: 'error en la autenticacion' }
            
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
        
                throw new Error(error.response?.data.detail);
            } 
        }
    },

    
    fetchAuthData: async (email) => {
 
        try {

            const response = await api.get(`/auth/profile?email=${email}`);
            const result = authUserSchema.safeParse(response.data)

            if (result.success) {
                set(() => ({
                    dataAuthProfileUser: result.data                        
                }))
            }
            const auth_data = get().dataAuthProfileUser
            localStorage.setItem('auth_data', JSON.stringify(auth_data))

        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data.detail);
            } 
        }
    }

})))










