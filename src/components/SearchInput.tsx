import { Search } from 'lucide-react'
import React from 'react'

type SearchInputProps = {
    handleChangeBuscar: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SearchInput({ handleChangeBuscar } : SearchInputProps) {
    
    return (
        <>
            <form className="max-w-md ">   
                <div className="relative">

                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <Search size={16} color='#6c7c93' />
                    </div>

                    <input type="search" id="default-search" className="block w-3xl p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:border-blue-500 " placeholder="Buscar por nombre o por codigo de barras..." onChange={handleChangeBuscar} />
                
                </div>
            </form>
        </>
    )
}
