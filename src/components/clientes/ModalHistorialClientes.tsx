import React from 'react'
import Tab from '../Tab'
import { usePosNetStore } from '../../store'


type ModalClientsProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>

}


export default function ModalHistorialClientes({ isOpen, setIsOpen }:ModalClientsProps) {
    const setDataPaginacion = usePosNetStore((state) => state.setDataPaginacion)

    const handleClickBackdrop = () => {
        setIsOpen(false)
        setDataPaginacion([])
    }  
  
    return (
        <div className="h-screen flex items-center justify-center">
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Backdrop con animación */}
                        <div
                        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 
                        opacity-20"
                        onClick={handleClickBackdrop}
                        ></div>

                        {/* Contenido del modal con animación */}
                        <div
                        className="relative bg-white rounded-md shadow-lg p-6 w-3xl z-10"
                        >
                            <h1 className='font-medium text-gray-700'>
                                Historial de Compras - Hola Mundo
                            </h1>
                            
                            <Tab />

                        </div>

                    </div>
                
                </>
            )}
        </div>
    )
}
