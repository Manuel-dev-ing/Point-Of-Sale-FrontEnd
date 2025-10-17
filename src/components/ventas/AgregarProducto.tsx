import { Barcode, Check } from 'lucide-react'
import React from 'react'

type AgregarProductoProps = {
    codidoBarras: string
    handleChangeBuscar: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
    handleClickAgregarProducto: () => void
}


export default function AgregarProducto({codidoBarras, handleChangeBuscar, handleKeyDown, handleClickAgregarProducto} : AgregarProductoProps) {
  return (
    <>
        <p className='text-gray-700 font-medium text-sm'>Codigo del Producto: </p>
        
        <div className="w-[960px]">   
            
            <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-700 ">
                <Barcode size={20} />
            </div>
            <input type="search" value={codidoBarras} className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
            onChange={handleChangeBuscar}
            onKeyDown={handleKeyDown}
            />
            </div>
        </div>

        <button type="button" className="flex items-center gap-1 text-white cursor-pointer btn-blue font-medium rounded text-sm px-5 py-2.5" onClick={handleClickAgregarProducto}>
            <Check color='#ffffff' size={18} strokeWidth={3} />
            Agregar Producto
        </button>
    
    </>
  )
}
