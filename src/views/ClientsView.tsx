import { useMutation, useQuery } from '@tanstack/react-query';
import { DollarSign, FolderOpen, Mail, Package, Phone, Plus, Search, ShoppingBag, SquarePen, Telescope, Trash2, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { deleteClient, getClients } from '../services/ClientsAPI';
import type { Clients } from '../types';
import ModalClients from '../components/clientes/ModalClients';
import { toast } from 'react-toastify';
import { usePosNetStore } from '../store';

export default function ClientsView() {

    const [isOpen, setIsOpen] = useState(false);
    const [ clients, setClient ] = useState<Clients[]>()
    const set_client = usePosNetStore((state) => state.set)

    
    const { data, isLoading, isError } = useQuery({
        queryFn: getClients,
        queryKey: ['Clients']

    });

    const mutation = useMutation({
        mutationFn: deleteClient,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Cliente Eliminado Correctamente")
        }
    })

    useEffect(() => {
        if (!data?.length) {
            return;
        }

        const resultado = [...data]
        setClient(resultado)

    }, [data])

    const handleChangeBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
        let valor = e.target.value
        
        const result = data?.filter(x => x.nombre.includes(valor) || x.correo?.includes(valor) || x.telefono?.includes(valor))
      
        setClient(result)

    }

    const handleClickEliminar = (id : number) => {
        console.log("Eliminando...");
        console.log(id);
        mutation.mutate(id)
    } 
    
    const handleClickEditar = (data : Clients) => {
        set_client(data)
        setIsOpen(true)
    }

    if (isLoading) return "obteniendo datos..."

  if(clients) return (
    <>
        <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold text-gray-700'>Gestion de Clientes</h1>

            <button type="button" className="flex items-center gap-4 text-white cursor-pointer btn-blue font-medium rounded text-sm px-5 py-2.5 " onClick={() => setIsOpen(true)}>
                <Plus size={17} />
                Nuevo Cliente
            </button>
        
        </div>

        <div className='border border-gray-300 mt-5 p-4 rounded bg-white '>
            
            <form className="max-w-md ">   
            
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                       <Search size={16} color='#6c7c93' />
                    </div>
                    <input type="search" id="default-search" className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 " placeholder="Busca por nombre, correo o telefono" onChange={handleChangeBuscar} />
              
                </div>
            </form>

        </div>
        <div className='flex justify-between'>
        
            <div className='flex items-center gap-2 border border-gray-300 p-3 bg-white mt-4 rounded w-80'>
                <Users size={20} color='#4573a1' />
                <div className='flex flex-col'>
                    <p className='text-gray-500 text-sm font-normal'>Total Clientes</p>
                    <span className='font-bold text-2xl text-gray-800'>{ data?.length }</span>
                </div>

            </div>
            <div className='flex items-center gap-2 border border-gray-300 p-3 bg-white mt-4 rounded w-80'>
                <ShoppingBag size={20} color='#44a166' />
                <div className='flex flex-col'>
                    <p className='text-gray-500 text-sm font-normal'>Compras Totales</p>
                    <span className='font-bold text-2xl text-gray-800'>77</span>
                </div>
            </div>
            <div className='flex items-center gap-2 border border-gray-300 p-3 bg-white mt-4 rounded w-80'>
                <DollarSign size={20} color='#e8ba30' />
                <div className='flex flex-col'>
                    <p className='text-gray-500 text-sm font-normal'>Ingresos Totales</p>
                    <span className='font-bold text-2xl text-gray-800'>$11,569</span>
                </div>
            </div>
        
        </div>

        <div className='mt-4 p-3 rounded border border-gray-300 bg-white'>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-sm text-gray-600  capitalize bg-gray-50 ">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Cliente
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Contacto
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Compras
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Total Gastado
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Ultima Compra
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id} className="bg-white border-b border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    { client.nombre + " " + client.primerApellido  }
                                </th>
                                <td className="px-6 py-4">
                                    <div className='flex items-center gap-1.5'>
                                        <Phone size={13} />
                                        <p>{client.telefono}</p>

                                    </div>
                                    <div className='flex items-center gap-1.5'>
                                        <Mail size={13} />
                                        <p>{client.correo}</p>
                                    </div>


                                </td>
                                <td className="px-6 py-4">
                                    <p className='text-gray-800'>15</p>
                            
                                </td>
                                <td className="px-6 py-4">
                                <p className='text-gray-800'>$15,569.50</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className='text-gray-800'>27/1/2024</p>
                                </td>
                                <td className="px-3 py-3">
                                    <div className='flex gap-2'>
                                        <button className='border border-gray-300 rounded py-2 px-2.5 cursor-pointer btn-edit-hover bg-gray-100 text-gray-800 font-medium text-xs w-24 '>Ver Historial</button>

                                        <button className='border border-gray-300 rounded py-2 px-2.5 cursor-pointer btn-edit-hover bg-gray-100' 
                                        onClick={() => handleClickEditar(client)}>
                                            <SquarePen
                                                size={18}
                                                color='#343d49'
                                            />
                                        </button>
                                        <button className='rounded py-2 px-3 bg-red bg-red-hover cursor-pointer' onClick={() => handleClickEliminar(client.id)}>
                                            <Trash2
                                                size={18}
                                                color='#ffffff'
                                            />
                                        </button>

                                    </div>                            
                                </td>
                            </tr>

                        ))}

                        
                       
                    </tbody>
                </table>
            </div>
        </div>

        <ModalClients
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        
        />                
    
    </>
  )
}






