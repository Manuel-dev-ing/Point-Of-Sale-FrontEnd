import React, { useEffect, useState } from 'react'
import { createArrayNums } from '../helpers'

type PaginationProps = {
    pagina: number
    setPagina: React.Dispatch<React.SetStateAction<number>>
    recordsPorPagina: number
}

export default function PaginationBack({pagina, setPagina, recordsPorPagina} : PaginationProps) {

    const [arrNums, setArrNums] = useState<number[]>([])

    useEffect(() => {
        const total = localStorage.getItem('totalRegistros')
        const total_registros = total ? JSON.parse(total) : 0 
        const resultado = Math.ceil(total_registros/recordsPorPagina)
        const arr_numero_paginas = createArrayNums(resultado)
       
        setArrNums(arr_numero_paginas)

    }, [])


    const handleClickPagina = (pagina : number) => {
        setPagina(pagina)
    }

    const handleClickAnterior = (pagina : number) => {
        setPagina(pagina)
    }

        
    const handleClickSiguiente = (pagina : number) => {
        setPagina(pagina)
    }
    
    return (
        <>
            <nav aria-label="Page navigation example" className='mt-2 '>
                <ul className="inline-flex -space-x-px text-base mb-5">
                    <li>
                        <button disabled={arrNums.length - (arrNums.length -1) === pagina ? true : false} className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 cursor-pointer ${pagina === arrNums.length - (arrNums.length -1) ? 'disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50' : ''} `} 
                        onClick={() => handleClickAnterior(pagina-1)}>
                            Previous
                        </button>
                    </li>
                    {arrNums.map((elemento) => (
                        <li>
                            <a key={elemento} className={`flex items-center justify-center cursor-pointer px-3 h-8 leading-tight ${elemento === pagina ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-500 bg-white'}  border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
                            onClick={() => handleClickPagina(elemento)}>
                                {elemento}
                            </a>
                        </li>
                    ))}
                    <li>
                        <button disabled={pagina === arrNums.length ? true : false} className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 cursor-pointer ${pagina === arrNums.length ? 'disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50' : ''} `}
                        onClick={() => handleClickSiguiente(pagina+1)}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        
        </>
    )
}
