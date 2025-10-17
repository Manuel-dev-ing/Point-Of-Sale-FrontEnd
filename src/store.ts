import { json } from "zod"
import type { Alerta, Categories, Category, Clients, Product, SaleData } from "./types"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

type PosNetStore = {
    data: Category | Clients | Product | {}
    set: (formData: Category | Clients | Product) => void
    activeId: number
    reset: () => void
    //ventas
    dataVenta: SaleData[] 
    //ventas productos pendientes
    dataPendingProducts: SaleData[]
    //modal
    isOpen: boolean
    setIsOpen: (open : boolean) => void
    //ventas
    setDataVenta: (formData: SaleData) => Alerta
    actualizarCantidad: (Data: SaleData[]) => void
    eliminarProducto: (id : number) => Alerta
    elimanarProductos: (ids : number[]) => Alerta
    setPendingProducts: (ids : number[]) => Alerta
    //state para guardar los elementos seleccionados
    dataProductsSelected: number[]
    setProductsSelected: (ids : number[]) => void
    changeProducts: (Data: SaleData[]) => void

}

const productsSale = () => {
    const productos = localStorage.getItem('productos')
    const arr_products : SaleData[] = productos ? JSON.parse(productos) : [] 
    return arr_products
}

const pendingProducts = () => {
    const productos = localStorage.getItem('pendingProducts')
    const arr_products : SaleData[] = productos ? JSON.parse(productos) : [] 
    return arr_products
}

export const usePosNetStore = create<PosNetStore>()(devtools((set, get) => ({
    dataVenta: productsSale(),
    dataPendingProducts: pendingProducts(),
    data: {},
    dataProductsSelected: [],
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
    actualizarCantidad: (formData) => {
        if (formData) {
            
            set(() => ({
                dataVenta: formData
            }))

            const products = get().dataVenta
            localStorage.setItem('productos', JSON.stringify(products))
        }
    },
    eliminarProducto: (id) => {
        const resultado = get().dataVenta.filter(x => x.idProducto != id);
        if (resultado) {
            console.log(resultado);
            
            set(() => ({
                dataVenta: resultado
            }))

            const products = get().dataVenta
            localStorage.setItem('productos', JSON.stringify(products))
            return { isSuccess: true, mensaje: `producto eliminado` }
        
        }else{
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



})))










