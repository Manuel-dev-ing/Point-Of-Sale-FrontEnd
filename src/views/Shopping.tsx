import { CreditCard, PackageX, Receipt, Trash2, Truck, User } from 'lucide-react'
import React, { use, useEffect, useState } from 'react'
import AgregarProducto from '../components/ventas/AgregarProducto'
import { toast } from 'react-toastify'
import Button from '../components/Button'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getProveedores } from '../services/ProveedoresAPI'
import { usePosNetStore } from '../store'
import type { ComprasData, Product } from '../types'
import { getAllProducts } from '../services/ProductsAPI'
import { calcularIVA } from '../helpers'
import { createCompra, totalCompras } from '../services/ComprasAPI'

export default function Shopping() {
    const [codidoBarras, setCodidoBarras] = useState<string>('')
    const [cobrar, setCobrar] = useState(false);
    const [proveedor, setProveedor] = useState<string>('1')
    const [products, setProducts] = useState<Product[]>()
    const [cantidad, setCantidad] = useState<number>()
    const [idProducto, setIdProducto] = useState<number>()
    const [nameShooping, setNameShooping] = useState<string>('shooping')

    const dataCompras = usePosNetStore((state) => state.dataCompras)
    const setDataCompra = usePosNetStore((state) => state.setDataCompra)
    const actualizarCantidad = usePosNetStore((state) => state.actualizarCantidad)
    const eliminarProducto = usePosNetStore((state) => state.eliminarProducto)
    const clearDataVenta = usePosNetStore((state) => state.clearDataVenta)

    const { data: dataTotalCompras, isLoading: isLoadingTotalCompras } = useQuery({
        queryFn: totalCompras,
        queryKey: ["totalCompras"]

    })


    const mutation = useMutation({
        mutationFn: createCompra,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Compra realizada correctamente")
            clearDataVenta(nameShooping)
        }
    })

    const { data: dataProveedores, isLoading } = useQuery({
        queryFn: getProveedores,
        queryKey: ['proveedores']
    })

    const { data, isLoading: isLoadingProductos } = useQuery({
        queryFn: getAllProducts,
        queryKey: ['products']
    })

    useEffect(() => {
    
        console.log("use effect...");

        if (!data?.length) return;

        const products = [...data]
        console.log(products);
        

        setProducts(products)

    }, [data])

    useEffect(() => {
        console.log("use effect 2");
    
        if (cantidad! && idProducto!) {
            const resultado = dataCompras.map(item => {
                if (item.idProducto === idProducto) {
                    item.cantidad = cantidad!
                }
                return item
            })
            
            actualizarCantidad(resultado, nameShooping)
            return
        }
            

    }, [cantidad, idProducto])
    
    const handleChangeActualizarCantidad = (e: React.ChangeEvent<HTMLInputElement>, idProducto: number) => {
        setCantidad(Number(e.target.value))
        setIdProducto(idProducto)
    }

    const handleClickCobrar = () => {

        // setCobrar(true)
        console.log("Cobrando...");

        const detalleCompra = dataCompras.map(item => {

            const {idProducto, cantidad, costoUnitario} = item
            
            const total = (cantidad * costoUnitario).toFixed(2)

            return { idProducto: idProducto, cantidad: cantidad, precio: costoUnitario, total: (calcularIVA(Number(total)) + Number(total)) }

        })

        const compra = {
            idUsuario: 1,
            idProveedor: Number(proveedor),
            numeroCompra: 1,
            subTotal: total,
            total: (calcularIVA(total) + total),
            DetalleCompra: detalleCompra
        }
        
        mutation.mutate(compra)

    }

    const handleChangeBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCodidoBarras(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

        if (e.key === "Enter") {
            if (e.target.value === '') {
                toast.error("Ingresa el codido de barras");
                return
            }
    
            guardarProducto()
        }
    }

    const handleClickAgregarProducto = () => {
           
        if (!codidoBarras) {
            toast.error("Ingresa el codido de barras");
            return
        }
        
        guardarProducto()
    
    }

    function guardarProducto() {
        const producto = products?.find(x => x.codigoBarras === codidoBarras)
        if (producto) {
        
            const item : ComprasData = {
                idProducto: producto.id,
                categoria: producto.categoria,
                producto: producto.descripcion,
                cantidad: 1,
                costoUnitario: producto.precio,
                subTotal: producto.precio
            }

            const resultado = setDataCompra(item)
            // setProductsSale( prev => [...prev, item])
            if (resultado.isSuccess) {
                toast.success(resultado.mensaje)
                setCodidoBarras('')
                
            }else{
                toast.error("Ocurrio un error");

            }

        }else{
            toast.error("Producto no encontrado");
        }
    }

    const handleChangeProveedor = (e: React.ChangeEvent<HTMLSelectElement>) => {
  
        setProveedor(e.target.value)
    }

    const handleClickEliminarProductos = () => {
         
        clearDataVenta(nameShooping)
    }

    const handleClickEliminar = (id : number) => {
        console.log("Eliminando...");
        console.log(id);
        const resultado = eliminarProducto(id, nameShooping)    
        if (resultado.isSuccess) {
            toast.success(resultado.mensaje)
        }else{
        
            toast.error(resultado.mensaje)
        }
        
    }

    const total = dataCompras.reduce((total, item) => total + (item.costoUnitario * item.cantidad), 0); 
    const cantidad_productos = dataCompras.reduce((total, item) => total + item.cantidad, 0)

    return (
        <>
            <div className='bg-gradient-to-r from-[#4c78a5] to-[#688cb1]/50 to-70% py-1 px-2'>
                <p className='text-white font-medium font-sans'>Compra No. {dataTotalCompras + 1}</p>
            </div>
            <div className='py-1 pl-18 flex items-center gap-2'>
                <label className='text-gray-700 font-medium text-sm flex gap-2' htmlFor="proveedor">
                    Proveedor
                    <Truck size={20} />
                </label>
                <select className='block w-[960px] p-2 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500' id="proveedor" 
                onChange={handleChangeProveedor} value={proveedor}>
                    {dataProveedores?.map((item, index) => (
                        <option key={index} value={item.id}>
                            {item.nombre + ' ' + item.primerApellido}
                        </option>
                    ))}
                </select>
            </div>
            <div className='p-2 flex justify-center items-center gap-2'>
            
                <AgregarProducto
                    codidoBarras={codidoBarras}
                    handleChangeBuscar={handleChangeBuscar}
                    handleKeyDown={handleKeyDown}
                    handleClickAgregarProducto={handleClickAgregarProducto}
                />
                
            </div>
            
            <div className='mt-1 p-3 rounded border border-gray-200 bg-white h-64 overflow-scroll'>
                <div className='relative'>
                    <table className='w-full text-sm text-left rtl:text-right text-gray-800'>
                        <thead className="text-sm text-gray-600 bg-gray-50 ">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-medium">
                                    Producto
                                </th>
                                <th scope="col" className="px-6 py-3 font-medium">
                                    Cantidad
                                </th>
                                <th scope="col" className="px-6 py-3 font-medium">
                                    Costo Unit.
                                </th>
                                <th scope="col" className="px-6 py-3 font-medium">
                                    Subtotal
                                </th>
                                <th scope="col" className="px-6 py-3 font-medium">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { dataCompras.length > 0 ? (
                                <>
                                    {dataCompras.map((item, index) => (
                                        <tr className="bg-white border-b  
                                            border-gray-200 hover:bg-gray-50" key={index} 
                                        >
                                            <td className="px-6 py-2 text-gray-700 font-semibold">
                                                <div className='flex flex-col'>
                                                    {item.producto}
                                                    <span className='text-gray-400 text-xs'>{item.categoria}</span>

                                                </div>
                                            </td>
                                            <td className="px-6 py-2 text-blue-700 font-semibold">
                                                <input className='border text-gray-900 border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500 p-1 w-14' type="number" 
                                                value={item.cantidad} 
                                                min={1}
                                                onChange={(e) => handleChangeActualizarCantidad(e, item.idProducto)}
                                                />
                                            </td>
                                            <td className="px-6 py-2 text-gray-700 font-semibold">
                                                ${item.costoUnitario.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-2 text-gray-700 font-semibold">
                                                ${total.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className='flex justify-start gap-4'>
                                                    
                                                    <button className='rounded py-2 px-3 bg-red bg-red-hover cursor-pointer' 
                                                    onClick={() => handleClickEliminar(item.idProducto)}>
                                                        <Trash2
                                                            size={18}
                                                            color='#ffffff'
                                                        />
                                                    </button>
        
                                                </div> 
                                            </td>

                                        </tr>

                                    ))}

                                </>
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                        <PackageX className="w-12 h-12 mb-2 text-gray-400" />
                                            <span className="text-lg font-medium">
                                                No hay productos a la compra
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

            </div>
            <div className='flex gap-2 py-2 px-1'>
                <div className='border w-2xl bg-white rounded border-gray-200'>
                    <div className='flex justify-between items-center gap-2'>
                        <Button
                            text={'Cobrar'}
                            disabled={dataCompras.length > 0 ? false : true}
                            type='button'
                            variant='border w-48 bg-[#4c78a5] py-3 px-2.5 rounded hover:bg-[#588ec4] flex justify-center items-center gap-2 text-white font-medium text-sm cursor-pointer 
                            disabled:bg-[#708faf] disabled:cursor-not-allowed'
                            onClick={handleClickCobrar}
                            icon={CreditCard}
                        />

                        <Button
                            text={'Eliminar'}
                            disabled={dataCompras.length > 0 ? false : true}
                            type='button'
                            variant='border w-48 bg-white border-gray-300 py-3 px-2.5 rounded hover:bg-gray-200 flex justify-center items-center gap-2 text-gray-700 font-medium text-sm cursor-pointer
                            disabled:bg-[#dadada] disabled:cursor-not-allowed'
                            onClick={handleClickEliminarProductos}
                            icon={Trash2}
                            iconColor='#1f2937'
                        />

                    </div>


                </div>
                
                <div className='w-lg p-2 border rounded-md border-gray-300'>
                    <p className='text-sm flex gap-2 font-medium mb-3'>
                        <Receipt size={18} />
                        Resumen Compra
                    </p>

                    <div className='flex gap-5'>
                        <div>
                            <div className='flex gap-16 mb-1'>
                                <p className='text-sm text-gray-600'>Productos: </p> 
                                <span className='text-sm text-gray-700 font-medium'>
                                    {cantidad_productos} unidades
                                </span>
                            </div>
                            <div className='flex gap-18'>
                                <p className='text-sm text-gray-600'>SubTotal:</p> 
                                <span className='text-sm text-gray-700 font-medium'>${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <div>
                            <div className='flex gap-12 mb-1'>
                                <p className='text-sm text-gray-600'>IVA (16%): </p> 
                                <span className='text-sm text-gray-700 font-medium'>${calcularIVA(total)}</span>
                            </div>
                            <div className='flex gap-18 items-center'>
                                <p className='text-md text-gray-900 font-semibold'>Total:</p> 
                                <span className='text-md text-gray-900 font-medium'>
                                    $ {(calcularIVA(total) + total).toFixed(2)}
                                </span>
                            </div>
                        </div>


                    </div>

                </div>
                <div className='border rounded w-72 flex justify-center items-center 
                bg-white border-gray-300 '>
                    <p className='text-center text-5xl font-bold text-[#4c78a5]'>
                        $<span>{(calcularIVA(total) + total).toFixed(2)}</span>
                    </p>                
                </div>
                           

            </div>                

            

        
        </>
    )
}
