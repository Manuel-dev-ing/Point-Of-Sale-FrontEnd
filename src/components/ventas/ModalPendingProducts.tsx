import React from 'react'
import { usePosNetStore } from '../../store'

export default function ModalPendingProducts() {
    const setIsOpen = usePosNetStore((state) => state.setIsOpen)
    const isOpen = usePosNetStore((state) => state.isOpen)
    const dataPendingProducts = usePosNetStore((state) => state.dataPendingProducts)

    const handleClickCerrar = () => {
        setIsOpen(false)
      
    }

    const handleClickBackdrop = () => {
        setIsOpen(false)
    }

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
                            <h3 className="text-lg font-medium text-gray-600 mb-4">Productos Pendientes</h3>
                            <div className='relative overflow-x-auto'>
                                <table className='w-full text-sm text-left rtl:text-right text-gray-800'> 
                                    <thead className="text-sm text-gray-600 bg-gray-50 ">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Codigo de Barras
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Descripcion del Producto
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Precio Venta
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Cantidad
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Importe
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Existencia
                                            </th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataPendingProducts.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-2 text-blue-700 font-semibold bg-blue-100">
                                                    {item.codigoBarras}
                                                </td>
                                                <td className="px-6 py-2">
                                                    {item.producto}
                                                </td>
                                                <td className="px-6 py-2 text-center">
                                                    ${item.precioVenta.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-2 text-center">
                                                    {item.cantidad}
                                                
                                                </td>
                                                <td className="px-6 py-2 font-semibold text-green-700 bg-green-100 text-right">
                                                    ${(item.precioVenta * item.cantidad).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-2 text-center">
                                                    {item.existencia}
                                                </td>
                                            
                                            </tr>
                                        ))}

                                    </tbody>

                                </table>                
                            </div>
                            <div className="flex justify-start gap-2 mt-5">
                                <button
                                    // onClick={() => setIsOpen(false)}
                                    type="submit"
                                    className="text-center text-white cursor-pointer btn-blue font-medium rounded text-sm px-5 py-2.5 transition w-xs">
                                    { true ? 'Guaradar Cambios' : 'Registrar Cliente' }
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
