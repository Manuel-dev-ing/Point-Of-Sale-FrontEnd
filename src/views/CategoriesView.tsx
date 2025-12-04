import { useMutation, useQuery } from '@tanstack/react-query'
import { FolderOpen, Package, Plus, Search, SquarePen, Trash2 } from 'lucide-react'
import { deleteCategories, getCategories } from '../services/CategoryAPI';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import ModalCategories from '../components/categories/ModalCategories';
import type { Categories, Category } from '../types';
import { usePosNetStore } from '../store';
import CardStatistics from '../components/CardStatistics';
import SearchInput from '../components/SearchInput';



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

            <SearchInput handleChangeBuscar={handleChangeBuscar} />    

        </div>
        
        <div className='flex justify-between'>
            
            <CardStatistics label='Total Categorias' value={data?.length} Icon={FolderOpen} iconColor='#4573a1' />

            <CardStatistics label='Total Productos' value={77} Icon={Package} iconColor='#44a166' />

            <CardStatistics label='Promedio por Categoria' value={11} Icon={FolderOpen} iconColor='#e8ba30' />
        
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
