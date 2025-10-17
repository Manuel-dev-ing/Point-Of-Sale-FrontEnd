import { useMutation, useQuery } from '@tanstack/react-query'
import { FolderOpen, Package, Plus, Search, SquarePen, Trash2 } from 'lucide-react'
import { deleteCategories, getCategories } from '../services/CategoryAPI';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import ModalCategories from '../components/categories/ModalCategories';
import type { Categories, Category } from '../types';
import { usePosNetStore } from '../store';



export default function CategoriesView() {
    const [isOpen, setIsOpen] = useState(false);
    const [ Categories, setCategories ] = useState<Categories>()

    const setCategory = usePosNetStore((state) => state.set)

    const { data, isError, isLoading } = useQuery({
        queryFn: getCategories,
        queryKey: ['categories']
    });

    const mutation = useMutation({
        mutationFn: deleteCategories,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Categoria eliminada")
        }
    })
    
    useEffect(() => {
        if (!data?.length) return;
        
        // const categories = 
        setCategories([...data])

    }, [data])

    if(isLoading) return 'obteniendo datos...'


    const handleClickEliminar = (id: number) => {
        mutation.mutate(id)
    } 
    
    const handleClickEditar = (data : Category) => {
        setIsOpen(true)
        setCategory(data)
        
    }

    const handleChangeBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
        let valor = e.target.value
        console.log(valor);
        const resultado = data?.filter(x => x.nombre.includes(valor))
        setCategories(resultado)

    }


  if(Categories?.length) return (
    <>
        <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold text-gray-700'>Gestion de Categorias</h1>

            <button type="button" className="flex items-center gap-4 text-white cursor-pointer btn-blue font-medium rounded text-sm px-5 py-2.5 " onClick={() => setIsOpen(true)}>
                <Plus size={17} />
                Nueva Categoria
            </button>
        
        </div>

        <div className='border border-gray-300 mt-5 p-4 rounded bg-white '>
            
            <form className="max-w-md ">   
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                       <Search size={16} color='#6c7c93' />
                    </div>
                    <input type="search" id="default-search" className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 " placeholder="Buscar categorias..." onChange={handleChangeBuscar} />
              
                </div>
            </form>

        </div>
        
        <div className='flex justify-between'>
        
            <div className='flex items-center gap-2 border border-gray-300 p-3 bg-white mt-4 rounded w-80'>
                <FolderOpen size={20} color='#4573a1' />
                <div className='flex flex-col'>
                    <p className='text-gray-500 text-sm font-normal'>Total Categorias</p>
                    <span className='font-bold text-2xl text-gray-800'>{ data?.length }</span>
                </div>

            </div>
            <div className='flex items-center gap-2 border border-gray-300 p-3 bg-white mt-4 rounded w-80'>
                <Package size={20} color='#44a166' />
                <div className='flex flex-col'>
                    <p className='text-gray-500 text-sm font-normal'>Total Productos</p>
                    <span className='font-bold text-2xl text-gray-800'>77</span>
                </div>
            </div>
            <div className='flex items-center gap-2 border border-gray-300 p-3 bg-white mt-4 rounded w-80'>
                <FolderOpen size={20} color='#e8ba30' />
                <div className='flex flex-col'>
                    <p className='text-gray-500 text-sm font-normal'>Promedio por Categoria</p>
                    <span className='font-bold text-2xl text-gray-800'>11</span>
                </div>
            </div>
        
        </div>

        <div className='mt-4 p-3 rounded border border-gray-300 bg-white'>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-sm text-gray-600  capitalize bg-gray-50 ">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Nombre
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Descripcion
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Productos
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Fecha Creacion
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Categories.map((category)=> (
                            <tr key={category.id} className="bg-white border-b border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {category.nombre}
                                </th>
                                <td className="px-6 py-4">
                                    {category.descripcion}
                                </td>
                                <td className="px-6 py-4">
                                    <div className='flex gap-1 bg-gray-200 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full'>
                                        {category.productos} 
                                        
                                        <span>productos</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {category.fechaCreacion}
                                </td>
                                <td className="px-6 py-3">
                                    <div className='flex gap-4'>
                                        <button className='border border-gray-400 rounded py-2 px-2.5 cursor-pointer btn-edit-hover bg-gray-100' 
                                        onClick={() => handleClickEditar(category)}>
                                            <SquarePen
                                                size={18}
                                                color='#343d49'
                                            />
                                        </button>
                                        <button className='rounded py-2 px-3 bg-red bg-red-hover cursor-pointer' onClick={() => handleClickEliminar(category.id)}>
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
        

        <ModalCategories
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        />
       

    </>
  )
}
