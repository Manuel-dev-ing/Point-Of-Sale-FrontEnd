import { useQuery } from '@tanstack/react-query'
import { ArrowLeftRight, CreditCard, PackageX, Star, Trash2, User } from 'lucide-react'
import { getAllProducts } from '../services/ProductsAPI'
import { useEffect, useState } from 'react'
import type { Product, SaleData, Venta } from '../types'
import { toast } from 'react-toastify'
import { getAllClients } from '../services/ClientsAPI'
import { usePosNetStore } from '../store'
import ModalPendingProducts from '../components/ventas/ModalPendingProducts'
import ModalChangeProduct from '../components/ventas/ModalChangeProduct'
import ModalCobrar from '../components/ventas/ModalCobrar'
import AgregarProducto from '../components/ventas/AgregarProducto'
import Button from '../components/Button'
import ResumenVenta from '../components/ventas/ResumenVenta'
import { totalVentas } from '../services/VentasAPI'

const initialDataVenta = {
    idUsuario: 0,
    idCliente: 0,
    numeroVenta: 0,
    subTotal: 0,
    total: 0,
    detalleVenta: []
}

export default function SalesPublic() {

    const [isOpen, setIsOpen] = useState(false);
    const [cobrar, setCobrar] = useState(false);
    const [selectCliente, setSelectCliente] = useState<string>('8')
    const [products, setProducts] = useState<Product[]>()
    const [codidoBarras, setCodidoBarras] = useState<string>('')
    const [cantidad, setCantidad] = useState<number>()
    const [idProducto, setIdProducto] = useState<number>()
    const [isChecked, setIsChecked] = useState<boolean>(true)
    const [productsSelected, setIsProductsSelected] = useState<number[]>([])
    const [venta, setVenta] = useState<Venta>(initialDataVenta)
    const [nameSales, setNameSales] = useState<string>('sales')
    // const [productsSale, setProductsSale] = useState<SaleData[]>([])

    const dataVenta = usePosNetStore((state) => state.dataVenta as SaleData[])
    const setDataVenta = usePosNetStore((state) => state.setDataVenta)
    const actualizarCantidad = usePosNetStore((state) => state.actualizarCantidad)
    const eliminarProducto = usePosNetStore((state) => state.eliminarProducto)
    const eliminarProductosVentas = usePosNetStore((state) => state.elimanarProductos)
    const setPendingProducts = usePosNetStore((state) => state.setPendingProducts)
    const setProductsSelected = usePosNetStore((state) => state.setProductsSelected)

    const {data: datatotalVentas, isLoading: isLoadingTotalVentas} = useQuery({
        queryFn: totalVentas,
        queryKey: ['totalVentas']
    })

    const { data, isLoading } = useQuery({
        queryFn: getAllProducts,
        queryKey: ['products']
    })

    const { data: dataClientes, isLoading:isLoadingClients } = useQuery({
        queryFn: getAllClients,
        queryKey: ['clients']
    })

    useEffect(() => {

        console.log("use effect...");

        if (!data?.length) return;

        const products = [...data]

        setProducts(products)
        setIsChecked(false)

    }, [data, dataVenta])

    useEffect(() => {
        console.log("use effect 2");
    
        if (cantidad! && idProducto!) {
            const resultado = dataVenta.map(item => {
                if (item.idProducto === idProducto) {
                    item.cantidad = cantidad!
                }
                return item
            })
       
           
            actualizarCantidad(resultado, nameSales)
            return
        }
            

    }, [cantidad, idProducto])
    
    const handleChangeBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCodidoBarras(e.target.value)
    }

    const handleClickAgregarProducto = () => {
       
        if (!codidoBarras) {
            toast.error("Ingresa el codido de barras");
            return
        }
     
        guardarProducto()
    
    }

    const handleChangeCliente = (e: React.ChangeEvent<HTMLSelectElement>) => {
    
        setSelectCliente(e.target.value)
    }

    const handleChangeActualizarCantidad = (e: React.ChangeEvent<HTMLInputElement>, idProducto: number) => {
        setCantidad(Number(e.target.value))
        setIdProducto(idProducto)
    }

    const handleClickEliminar = (id : number) => {

        const resultado = eliminarProducto(id, nameSales)    
        if (resultado.isSuccess) {
            toast.success(resultado.mensaje)
        }else{
        
            toast.error(resultado.mensaje)
        }    
    }

    const handleChangeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    
        let valor = Number(e.target.value)
        setIsChecked(!isChecked)
        if (productsSelected.includes(valor)) {
            const result = productsSelected.filter(x => x != valor)

            setIsProductsSelected(result)
            
            return
        }

        productsSelected!.push(valor)
        setIsProductsSelected(productsSelected)
    }  
    
    const handleClickEliminarProductos = () => {
     
        const result = eliminarProductosVentas(productsSelected)
        
        if (result.isSuccess) {
            toast.success(result.mensaje)
            setIsProductsSelected([])
            setIsChecked(false)
        }
    }

    const handleClickPending = () => {

        setPendingProducts(productsSelected)
        setIsProductsSelected([])
        setIsChecked(false)
        toast.success("Productos guardado en pendiente")
    }

    const handleClickCambiar = () => {
        setIsOpen(true)

        setProductsSelected(productsSelected)
    }

    const handleClickCobrar = () => {

        setCobrar(true)
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

    function guardarProducto() {
        const producto = products?.find(x => x.codigoBarras === codidoBarras)
        if (producto) {
        
            const item : SaleData = {
                idProducto: producto.id,
                codigoBarras: producto.codigoBarras,
                producto: producto.descripcion,
                precioVenta: producto.precio,
                cantidad: 1,
                existencia: producto.stockInicial
            }

            const resultado = setDataVenta(item)
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

    const total = dataVenta.reduce((total, item) => total + (item.precioVenta * item.cantidad), 0); 
    const cantidad_productos = dataVenta.reduce((total, item) => total + item.cantidad, 0)

    if (isLoading) return 'obteniendo productos...'

  return (
    <>
        <div className='bg-gradient-to-r from-[#4c78a5] to-[#688cb1]/50 to-70% py-1 px-2'>
            <p className='text-white font-medium font-sans'>Venta Ticket - {datatotalVentas + 1}</p>
        </div>
        <div className='py-1 pl-18 flex items-center gap-2'>
            <label className='text-gray-700 font-medium text-sm flex gap-2' htmlFor="cliente">
                Cliente
                <User size={20} />
            </label>
            <select className='block w-[960px] p-2 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500' id="cliente" value={selectCliente}
            onChange={handleChangeCliente}>
                {dataClientes?.map((item) => (
                    <option key={item.id} value={item.id}>{item.nombre + " " + item.primerApellido }</option>
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
            <div className="relative">
                <table className="w-full text-sm text-left rtl:text-right text-gray-800 ">
                    <thead className="text-sm text-gray-600 bg-gray-50 ">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">
                                
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Codigo de Barras
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Descripcion del Producto
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Precio Venta
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Cantidad
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Importe
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Existencia
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                   
                    <tbody>
                        {dataVenta.length > 0 ? (
                        <>
                            {dataVenta.map((item, index) => (
                                <tr key={index} className="bg-white border-b  
                                border-gray-200 hover:bg-gray-50">
                                    
                                    <td className="w-4 p-2">
                                        <div className="flex items-center">
                                            <input id="checkbox-table-search-1"
                                            value={item.idProducto} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500" 
                                            onChange={handleChangeCheck}
                                            />
                                            
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 text-blue-700 font-semibold bg-blue-100">
                                        {item.codigoBarras}
                                    </td>
                                    <td className="px-6 py-2">
                                        {item.producto}
                                    </td>
                                    <td className="px-6 py-2 text-center">
                                        ${item.precioVenta.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-2 text-center">
                                        
                                        <input className='border text-gray-900 border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500 p-1 w-14' type="number" value={item.cantidad} min={1} 
                                        onChange={(e) => handleChangeActualizarCantidad(e, item.idProducto)} />
                                    </td>
                                    <td className="px-6 py-2 font-semibold text-green-700 bg-green-100 text-right">
                                        ${(item.precioVenta * item.cantidad).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-2 text-center">
                                        {item.existencia}
                                    </td>
                                    <td className="px-6 py-2">
                                        <div className='flex justify-center gap-4'>
                                            
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
                        ): (
                            <tr>
                                <td colSpan={8} className="p-10 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                    <PackageX className="w-12 h-12 mb-2 text-gray-400" />
                                        <span className="text-lg font-medium">
                                            No hay productos a la venta
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
            <div className='w-2xl bg-white rounded border-gray-200'>
                <div className='flex justify-center items-center gap-2'>
                    <Button
                        text={'Cobrar'}
                        disabled={dataVenta.length === 0 ? true: false}
                        type='button'
                        variant='border w-48 bg-[#4c78a5] py-3 px-2.5 rounded hover:bg-[#588ec4] flex justify-center items-center gap-2 text-white font-medium text-sm cursor-pointer 
                        disabled:bg-[#708faf] disabled:cursor-not-allowed'
                        onClick={handleClickCobrar}
                        icon={CreditCard}
                    />
                    <Button
                        text={'Cambiar'}
                        disabled={productsSelected.length === 0 ? true : false}
                        type='button'
                        variant='border w-48 bg-gray-50 border-gray-300 py-3 px-2.5 rounded hover:bg-gray-200 flex justify-center items-center gap-2 text-gray-700 font-medium text-sm cursor-pointer
                        disabled:bg-[#dadada] disabled:cursor-not-allowed'
                        onClick={handleClickCambiar}
                        icon={ArrowLeftRight}
                        iconColor='#157347'
                    />
                    <Button
                        text={'Pendiente'}
                        disabled={productsSelected.length === 0 ? true : false}
                        type='button'
                        variant='border w-48 bg-gray-50 border-gray-300 py-3 px-2.5 rounded hover:bg-gray-200 flex justify-center items-center gap-2 text-gray-700 font-medium text-sm cursor-pointer
                        disabled:bg-[#dadada] disabled:cursor-not-allowed'
                        onClick={handleClickPending}
                        icon={Star}
                        iconColor='#ffc107'
                    />
                    <Button
                        text={'Eliminar'}
                        disabled={productsSelected.length === 0 ? true : false}
                        type='button'
                        variant='border w-48 bg-[#c44141] py-3 px-2.5 rounded hover:bg-[#bb4d4d] flex justify-center items-center gap-3 text-white font-medium text-sm cursor-pointer
                        disabled:bg-[#ad5858] disabled:cursor-not-allowed'
                        onClick={handleClickEliminarProductos}
                        icon={Trash2}
                        iconColor='#ffffff'
                    />

                </div>           
            </div>                 
            <ResumenVenta
                total={total}
                cantidadProductos={cantidad_productos}
            />

        </div>                  

        <ModalPendingProducts />
        <ModalChangeProduct
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        />
        <ModalCobrar 
            cobrar={cobrar}
            setCobrar={setCobrar}
            total={total}
            dataVenta={dataVenta}
        />            


    </>
  )
}
