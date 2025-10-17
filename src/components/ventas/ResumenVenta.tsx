import { Receipt } from 'lucide-react'
import React from 'react'


type ResumenVentaProps = {
    total: number
    cantidadProductos: number
}


export default function ResumenVenta({total, cantidadProductos} : ResumenVentaProps) {
  
    return (
        <>
            <div className='w-lg p-2 border rounded-md border-gray-300'>
                <p className='text-sm flex gap-2 font-medium mb-3'>
                    <Receipt size={18} />
                    Resumen Venta
                </p>
                <div className='flex gap-16 mb-0.5'>
                    <p className='text-sm text-gray-600'>Productos:</p> 
                    <span className='text-sm text-gray-900 font-medium'>{cantidadProductos}</span>
                </div>
                <div className='flex gap-18'>
                    <p className='text-sm text-gray-600'>SubTotal:</p> 
                    <span className='text-sm text-gray-900 font-medium'>${total.toFixed(2)} </span>
                </div>

            </div>
            <div className='border rounded w-72 flex justify-center items-center 
            bg-white border-gray-300 '>
                <p className='text-center text-5xl font-bold text-[#4c78a5]'>$ <span>{total.toFixed(2)}</span></p>                
            </div>
        
        
        </>

    )
}
