import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FolderOpen, Package, Plus, Search, SquarePen, Trash2, TriangleAlert } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { deleteProduct, getProducts } from '../services/ProductsAPI'
import type { Product } from '../types'
import { getCategories } from '../services/CategoryAPI'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { usePosNetStore } from '../store'

export default function ProductsView() {
    const [product, setProducts] = useState<Product[]>()
    const [select, setSelect] = useState<string>('')
    const [categoria, setCategoria] = useState<string>('')

    const set_product = usePosNetStore((state) => state.set)

    const navigate = useNavigate()

    const queryClient = useQueryClient();

    const { isLoading, isError, data } = useQuery({
        queryFn: getProducts,
        queryKey: ['products']
    })

    const { isLoading: isLoadingCategory, data: dataCategory } = useQuery({
        queryFn: getCategories,
        queryKey: ['categories']
    })

    const mutationDelete = useMutation({
        mutationFn: deleteProduct,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Producto eliminado correctamente")
            queryClient.invalidateQueries({queryKey: ['products']})
        }
    })

    useEffect(() => {
        console.log("use effect...");
        

        if (!data?.length) return;

        const resultado = [...data]
        if (categoria != '') {
            console.log("si hay categoria en el state..");
            const categorias = resultado.filter(x => x.categoria === categoria)
            console.log(categorias);
            setProducts(categorias)
            return
        }   

        setProducts(resultado)

    }, [data, categoria])
    
    const stock_bajo = product?.filter(x => x.stockInicial < x.stockMinimo).length
    const valor_inventario = product?.reduce((acum, prod) => acum + prod.precio, 0)

    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {

        if (Number(e.target.value) !== 0) {
            
            const id_categoria = Number(e.target.value)
            const categoria = dataCategory?.find(x => x.id === id_categoria)
         
            setCategoria(categoria!.nombre)
    
            setSelect(e.target.value)
            return
        }

        setSelect(e.target.value.toString())
        setCategoria('')
    }
    
    const handleChangeBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        let valor = e.target.value

        const resultado = data?.filter( x => x.nombre.includes(valor) || x.codigoBarras.includes(valor))
        setProducts(resultado)
    }

    const handleClickEliminar = (id : number) => {
        console.log("eliminando...");
        console.log(id);
        mutationDelete.mutate(id)
    }

    const handleClickEditar = (product : Product) => {
        console.log("actualizando...");
        
        console.log(product);

        set_product(product)
        navigate('/products/add')
    }

    if (isLoading || isLoadingCategory) return 'obteniendo datos...'

  if(product) return (
    <>
    
        <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold text-gray-700'>Gestion de Productos</h1>

            <Link to={'/products/add'} type="button" className="flex items-center gap-4 text-white cursor-pointer btn-blue font-medium rounded text-sm px-5 py-2.5">
                <Plus size={17} />
                Agregar Producto
            </Link>
        
        </div>

        <div className='border border-gray-300 mt-5 p-4 rounded bg-white flex gap-3 justify-between'>
            
            <form className="max-w-md ">   
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <Search size={16} color='#6c7c93' />
                    </div>
                    <input type="search" id="default-search" className="block w-3xl p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:border-blue-500 " placeholder="Buscar por nombre o por codigo de barras..." onChange={handleChangeBuscar} />
                
                </div>
            </form>

            <select id="countries" className="bg-gray-50 border border-gray-300
             text-gray-700 text-sm rounded focus:ring-blue-500 focus:border-blue-500 p-2.5 w-52" 
             onChange={handleChangeSelect} value={select}>
                <option value={0}>Todas las categorias</option>
                {dataCategory?.map((category, index) => (
                    
                    <option key={index} value={category.id}>{category.nombre}</option>
                    
                ))}
            </select>

        </div>

        <div className='flex justify-between'>
        
            <div className='flex items-center gap-2 border border-gray-300 p-3 bg-white mt-4 rounded w-80'>
                <Package size={20} color='#4573a1' />
                <div className='flex flex-col'>
                    <p className='text-gray-500 text-sm font-normal'>Total Productos</p>
                    <span className='font-bold text-2xl text-gray-800'>{ data?.length }</span>
                </div>

            </div>
            <div className='flex items-center gap-2 border border-gray-300 p-3 bg-white mt-4 rounded w-80'>
                <TriangleAlert size={20} color='#e8ba30' />
                <div className='flex flex-col'>
                    <p className='text-gray-500 text-sm font-normal'>Stock Bajo</p>
                    <span className='font-bold text-2xl text-yellow-500'>{stock_bajo}</span>
                </div>
            </div>
            <div className='flex items-center gap-2 border border-gray-300 p-3 bg-white mt-4 rounded w-80'>
                <Package size={20} color='#44a166' />
                <div className='flex flex-col'>
                    <p className='text-gray-500 text-sm font-normal'>Valor Inventario</p>
                    <span className='font-bold text-2xl text-green-600'>{valor_inventario?.toFixed(2)}</span>
                </div>
            </div>
        
        </div>

        <div className='mt-4 p-3 rounded border border-gray-300 bg-white'>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-sm text-gray-600  capitalize bg-gray-50 ">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Producto
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Categoria
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Precio
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Stock
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Codigo
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.map((product)=> (
                            <tr key={product.id} className="bg-white border-b border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {product.nombre}
                                </th>
                                <td className="px-6 py-4">
                                    {product.categoria}
                                </td>
                                <td className="px-6 py-4">
                                    {product.precio}
                                </td>
                                <td className="px-6 py-4">
                                    {product.stockInicial}
                                </td>
                                <td className="px-6 py-4">
                                    {product.codigoBarras}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`${product.stockInicial >= product.stockMinimo ? '   bg-blue-900' : 'bg-red-900'} text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-lg`}>
                                        {product.stockInicial >= product.stockMinimo ? 'Disponible' : 'Stock Bajo'}
                                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    <div className='flex gap-4'>
                                        <button className='border border-gray-400 rounded py-2 px-2.5 cursor-pointer btn-edit-hover bg-gray-100' 
                                        onClick={() => handleClickEditar(product)}>
                                            <SquarePen
                                                size={18}
                                                color='#343d49'
                                            />
                                        </button>
                                        <button className='rounded py-2 px-3 bg-red bg-red-hover cursor-pointer' onClick={() => handleClickEliminar(product.id)}>
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

    
    </>
  )
}
