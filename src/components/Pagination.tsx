import React, { useEffect, useState } from 'react'
import { usePosNetStore } from '../store'
import type { HistorialCompras } from '../types'
import { record } from 'zod'

export default function Pagination() {
    const dataPaginacion = usePosNetStore((state) => state.dataPaginacion)
    const setDataPaginas = usePosNetStore((state) => state.setDataPaginas)

    const [active, setActive] = useState<boolean>(true)
    const [activeNext, setActiveNext] = useState<boolean>(false)
    const [pagina, setPagina] = useState<number>(0)
    const [recordsPorPagina, setRecordsPorPagina] = useState<number>(5)
    const [cantidadTotalRecords, setCantidadTotalRecords] = useState<number>(dataPaginacion.length)
    const [records, setRecords] = useState<HistorialCompras[][]>([])

    console.log("Resultado de dividir la cantidadTotalRecords / recordsPorPagina: ");
    // console.log(Math.ceil(cantidadTotalRecords / recordsPorPagina));

    // si la cantidad total de records es 37, 
    // entonces dividir la cantidadTotalRecords / recordsPorPagina
    // el resultado sera la cantidad de arreglos, por ejemplo si el resultado es 4 entonces seran 4 arreglos  

    useEffect(() => {
        const result = Math.ceil(cantidadTotalRecords / recordsPorPagina)

        let inicio = 0
        let fin = recordsPorPagina - 1
        let data_records = []

        for (let index = 1; index <= result; index++) {
            let arr = []
            for (let i = inicio; i <= fin; i++) {
                
                if (dataPaginacion[i] === undefined) {
                    break
                }
                
                arr.push(dataPaginacion[i])
            }
            data_records.push(arr)
            inicio = fin + 1 // 5
            fin = fin + 5 // 9
            
        }

        // console.log(data_records);
        setRecords(data_records)

    }, [dataPaginacion])

    useEffect(() => {

        if (records.length > 0) {
            console.log("records mayor que cero...");
            setDataPaginas(records[0])
            return
        }
        

    
    }, [records])

    const establecerPagina = (index:number) => {
        const last_page = records.length -1
  
        setPagina(index)        
        setDataPaginas(records[index])

        if (index === last_page) {

            setActiveNext(true)
        }else if(index <= 0 ){
            
            setActive(true)
            setActiveNext(false)

        }else if(index > 0){
            setActive(false)

        }
       
        
    }

    const handlePrevious = () => {

        const result = pagina - 1
        
        if (result === -1) {
            setActive(true)

        }

        setPagina(result)
        setDataPaginas(records[result])
        
    }

    const handleNext = () => {
        const result = pagina + 1
        const last_page = records.length -1

        setPagina(result)
        setDataPaginas(records[result])

        if (result === last_page) {
            setActiveNext(true)
            
        }
    }

    return (
        <div className='mt-3'>
                                
            <nav aria-label="Page navigation example ">
                <ul className="inline-flex -space-x-px text-sm h-10">
                    <li>
                        <button  disabled={active} className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${active === true ? 'disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50' : ''} `}
                        onClick={() => handlePrevious()}
                        >
                            Previous
                        </button>
                    </li>

                    {records.map((item, index) => (
                        <li key={index}>
                            <a 
                                className={`flex items-center justify-center cursor-pointer px-3 h-8 leading-tight ${pagina === index ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-500 bg-white'}  border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
                                onClick={() => establecerPagina(index)}>
                                {index + 1}
                            </a>
                        </li>
                    ))}
                    
                    <li>
                        <button disabled={activeNext} className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 cursor-pointer ${activeNext === true ? 'disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50' : ''} `}
                        onClick={() => handleNext()}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>   

        </div>
    )
}
