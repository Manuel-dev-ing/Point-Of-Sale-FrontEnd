import { Calendar, ShoppingBag } from 'lucide-react';
import React, { useState } from 'react'
import Pagination from './Pagination';
import { usePosNetStore } from '../store';
import type { HistorialCompras } from '../types';

export default function Tab() {
    const [activeTab, setActiveTab] = useState<number>(0);
    const dataPaginas = usePosNetStore((state) => state.dataPaginas as HistorialCompras[])

    const tabs = [
        { label: 'Compras', content: 'This is the Profile tab content.' },
        { label: 'Resumen', content: 'Manage your application settings here.' },
    ];
    
    return (
        <div className="w-full mt-4">
            {/* Tab Headers */}
            <div className="flex items-center justify-between bg-[#edf0f2] py-1.5 px-1 rounded-sm">
                {tabs.map((tab, index) => (
                <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`rounded-md py-1.5 px-16 text-sm font-medium transition-colors duration-300 cursor-pointer
                    ${activeTab === index 
                        ? 'bg-white text-gray-800 w-[320px]' 
                        : 'text-gray-500 hover:text-gray-700 '}`}
                >
                    {tab.label}
                </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-2 bg-white ">
                {activeTab === 0 ? (
                    <>
                        <h1>Tabla</h1>
                        {tabs[activeTab].content}{" "}{activeTab}
                        <div className='rounded border border-gray-200 bg-white'>
                            <div className="relative overflow-x-auto">
                                <table className='w-full text-sm text-left rtl:text-right text-gray-500'>
                                    <thead className='text-sm text-gray-600 capitalize bg-gray-50'>
                                        <tr>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Fecha
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Items
                                            </th>
                                            <th scope="col" className="px-6 py-3 font-medium">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataPaginas.map((item, index) => (

                                            <tr key={index} className='bg-white border-b border-gray-200'>
                                                <th scope="row" className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">
                                                    {item.fecha}
                                                </th>
                                                <th scope="row" className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">
                                                    {item.items}{" productos"}
                                                </th>
                                                <th scope="row" className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">
                                                    {item.total.toFixed(2)}
                                                </th>
                                            </tr>
                                        ))}

                                    

                                    </tbody>
                                </table>

                            </div>
                        </div>


                        <Pagination />

                    </>
                ): (
                    <>

                        <div className='flex gap-5'>
                            <div className='flex items-center gap-2 w-full border border-gray-300 rounded bg-white px-4 py-3'>
                                <Calendar color='#808c85' size={17} />
                                {/* {tabs[activeTab].content}{" "}{activeTab} */}

                                <div>
                                    <p className='font-normal text-gray-500 text-sm'>Cliente desde</p>
                                    <span className='text-gray-700 font-medium'>14/10/23</span>
                                </div>

                            </div>
                            <div 
                                className='flex items-center gap-2 w-full px-4 py-3 border border-gray-300 rounded bg-white p-2'>
                                
                                <ShoppingBag color='#808c85' size={17} />

                                <div>
                                    <p className='font-normal text-gray-500 text-sm'>
                                        Promedio por compra
                                    </p>
                                    <span className='text-gray-700 font-medium'>
                                        $192.36
                                    </span>
                                </div>

                            </div>
                        </div>

                    </>
                )}

            </div>
        </div>
    )
    
}
