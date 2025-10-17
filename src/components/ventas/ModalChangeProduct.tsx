import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { getProducts } from '../../services/ProductsAPI'
import type { SaleData } from '../../types'
import { toast } from 'react-toastify'
import { usePosNetStore } from '../../store'


type ModalChangeProductProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ModalChangeProduct({ isOpen, setIsOpen } : ModalChangeProductProps) {
    const [isChecked, setIsChecked] = useState<boolean>(true)
    const [products, setProducts] = useState<SaleData[]>([])

    const changeProducts = usePosNetStore((state) => state.changeProducts)


    const { isLoading, isError, data } = useQuery({
        queryFn: getProducts,
        queryKey: ['products']
    })

    const handleChangeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("handle change check modal change product");
        setIsChecked(!isChecked)
        
        let codigoBarras = e.target.parentElement?.parentElement?.parentElement?.childNodes[5].textContent
        const product = data?.find(x => x.codigoBarras === codigoBarras)

        console.log(products.some(x => x.idProducto === product?.id));

        if (products.some(x => x.idProducto === product?.id) === false) {
            const item : SaleData = {
                idProducto: product!.id,
                codigoBarras: product!.codigoBarras,
                producto: product!.descripcion,
                precioVenta: product!.precio,
                cantidad: 1,
                existencia: product!.stockInicial
            }

            products.push(item)    
            return
        }
    }

    const handleClickGuardar = () => {
        if (products.length > 0) {
            console.log("guardando...");
            changeProducts(products)
            setIsOpen(false)
            return
        }
        toast.error("Selecciona productos")
        console.log("No hay productos");
        
    }

    const handleClickCerrar = () => {
        setIsOpen(false)
     
    }

    const handleClickBackdrop = () => {
        setIsOpen(false)
    
    }

    if (isLoading) return 'obteniendo productos...'

  return (
    <>
        {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop con animación */}
                    <div
                    className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 
                    opacity-20" onClick={handleClickBackdrop}></div>

                    {/* Contenido del modal con animación */}
                    <div className="relative bg-white rounded-md shadow-lg p-6 w-[1050px] z-10">
                            <h3 className="text-lg font-medium text-gray-600 mb-4">Productos</h3>
                            <div className='relative overflow-x-auto'>
                                <table className='w-full text-sm text-left rtl:text-right text-gray-800'> 
                                    <thead className="text-sm text-gray-600 bg-gray-50 ">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Producto
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Categoria
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Precio
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Stock
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Codigo
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.map((item, index) => (
                                            <tr key={index}>
                                                <td className="w-4 p-2">
                                                    <div className="flex items-center">
                                                        <input id="checkbox-table-search-1"
                                                        value={item.id} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500" 
                                                        onChange={handleChangeCheck}
                                                        />
                                                        
                                                    </div>
                                                </td>
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    {item.nombre}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {item.categoria}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.precio}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.stockInicial}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.codigoBarras}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`${item.stockInicial >= item.stockMinimo ? '   bg-blue-900' : 'bg-red-900'}  text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-lg`}>{item.stockInicial >= item.stockMinimo ? 'Disponible' : 'Stock Bajo'}</span>
                                                </td>
                                            
                                            </tr>
                                        ))}

                                    </tbody>

                                </table>                
                            </div>
                            <div className="flex justify-start gap-2 mt-5">
                                <button
                                    onClick={handleClickGuardar}
                                    type="submit"
                                    className="text-center text-white cursor-pointer btn-blue font-medium rounded text-sm px-5 py-2.5 transition w-xs">
                                    {'Guaradar Cambios'  }
                                </button>
                                <button
                                    className="px-4 py-2 text-gray-800 font-medium text-sm bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer"
                                    onClick={handleClickCerrar}>
                                    Cancelar
                                </button>
                            </div>
                    </div>
                </div>

            )}
    
    
    </>
  )
}

