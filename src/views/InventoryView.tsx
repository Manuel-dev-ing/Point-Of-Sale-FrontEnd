import { useQuery } from '@tanstack/react-query'
import { ArrowUpDown, Minus, Package, Plus, Search, TrendingUp, TriangleAlert, Warehouse } from 'lucide-react'
import { getAllProducts } from '../services/ProductsAPI'
import { useEffect, useState } from 'react'
import ModalMovimientos from '../components/inventarios/ModalMovimientos'
import { getMovements } from '../services/InventarioAPI'
import { getCategories } from '../services/CategoryAPI'
import type { Product } from '../types'
import CardStatistics from '../components/CardStatistics'
import SearchInput from '../components/SearchInput'

export default function InventoryView() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [idProducto, setIdProducto] = useState<number>(0)
  const [categoria, setCategoria] = useState<string>("")
  const [products, setProducts] = useState<Product[]>()
 
  const { data: data_products, isLoading } = useQuery({
    queryFn: getAllProducts,
    queryKey: ['allProducts']

  })

  const { data: data_movements, isLoading: isLoadingMovements } = useQuery({
    queryFn: getMovements,
    queryKey: ['moviments']
  })

  const { data: data_categories, isLoading: isLoadingCategories } = useQuery({
    queryFn: getCategories,
    queryKey: ['categories']
  })
  
  useEffect(() => {
    if (!data_products?.length) return

    const resultado = [...data_products]

    if (categoria != "") {
       
      const result = resultado.filter(x => x.categoria === categoria)
      setProducts(result)
      return;
    }

    setProducts(resultado)
  }, [data_products, categoria])

  const handleClickMovimiento = (id : number) => {
    
    setIsOpen(true)
    setIdProducto(id)
  
  }

  const getProductName = (idProducto : number) => {

    const producto = data_products?.find(x => x.id === idProducto)

    return producto?.nombre

  }

  const hanedleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const id_category = e.target.value
    setCategoria(id_category)

    
  }

  const handleChangeBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    let valor = e.target.value
    const resultado = data_products?.filter(x => x.nombre.includes(valor))
    console.log(resultado);
    setProducts(resultado)
    
  }

  const stock_bajo = data_products?.filter(x => x.stockInicial < x.stockMinimo).length
  const unidades_totales = data_products?.reduce((total, item) => {
    return total + item.stockInicial
  } , 0)
  const valor_inventario = data_products?.reduce((total, item) => {
    return total + item.precio
  } , 0)

  return (
    <>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-700'>Gestion de Inventario</h1>
    
      </div>

      <div className='border border-gray-300 mt-5 p-4 rounded bg-white flex gap-3 justify-between'>

        <SearchInput handleChangeBuscar={handleChangeBuscar} />        

        <select id="countries" className="bg-gray-50 border border-gray-300
          text-gray-700 text-sm rounded focus:ring-blue-500 focus:border-blue-500 p-2.5 w-52"
          onChange={hanedleChangeCategory}
          value={categoria} 
          >
          <option value={''}>Todas las categorias</option>
          {data_categories?.map((item, index) => (
            <option key={index} value={item.nombre}>{item.nombre}</option>
          ))}
       
        </select>
  
      </div>  

      <div className='flex justify-between'>

        <CardStatistics label='Total Productos' value={data_products?.length} Icon={Warehouse} iconColor='#4573a1' variant="w-64" />      
        
        <CardStatistics label='Stock Bajo' value={stock_bajo} Icon={TriangleAlert} iconColor='#e8ba30' variant="w-64" />

        <CardStatistics label='Unidades Totales' value={unidades_totales} Icon={Package} iconColor='#44a166' variant="w-64" />

        <CardStatistics label='Valor Inventario' value={valor_inventario?.toFixed(2)} Icon={TrendingUp} iconColor='#44a166' variant="w-64" />      
      
      </div>        

      <div className='mt-4 p-3 rounded border border-gray-300 bg-white'>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-sm text-gray-600 capitalize bg-gray-50 ">
                <tr>
                    <th scope="col" className="px-6 py-3 font-medium">
                        Producto
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                        Categoria
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                        Stock Actual
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                        Stock Min/Max
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                        Estado
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                        Valor
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                        Acciones
                    </th>
                </tr>
            </thead>
            <tbody>
              {products?.map((product, index) => (
                <tr key={index}>
                  <th className="px-6 py-4 font-medium">
                    {product.nombre}
                  </th>
                  <th className="px-6 py-4">
                    <p className='text-center bg-gray-200 text-gray-800 text-xs font-medium me-2 rounded-full'>
                      {product.categoria}
                    </p>
                  </th>
                  <th className="px-6 py-4 font-medium text-gray-700">
                    {product.stockInicial}
                  </th>
                  <th className="px-6 py-4 font-medium text-gray-700">
                    <p>{product.stockInicial}/{product.stockMinimo}</p>
                  </th>
                  <th className="px-6 py-4">
                      <div className={`${product.stockInicial >= product.stockMinimo ? 'bg-[#436a92]' : 'bg-red-900'} text-white text-xs font-medium px-1 py-0.5 rounded-lg`}>
                
                          <div className='flex items-center justify-center gap-1'>
                            {product.stockInicial >= product.stockMinimo ? 
                            (
                              <>
                                <Package size={12} /> 
                                <span>Normal</span> 
                              </>
                            
                            ):
                            (
                              <>
                                <TriangleAlert size={12} /> 
                                <span>Stock Bajo</span> 
                              </>
                            )}

                          </div>

                      </div>
                  </th>
                  <th className="px-6 py-4 font-medium text-gray-700">
                    <p>${(product.stockInicial * product.precio).toFixed(2)}</p>
                  </th>
                  <th className="px-6 py-4">
                    <button className='flex items-center gap-2 bg-white border border-gray-300 py-1.5 px-2 rounded font-medium text-gray-700 hover:bg-[#d6dde4] hover:cursor-pointer'
                    onClick={() => handleClickMovimiento(product.id)}>
                      <ArrowUpDown size={16} />
                      Movimiento
                    </button>
                  </th>
                
                </tr> 

              ))}
              
                
            </tbody>
          </table>
        </div>
      </div>

      <div className='mt-8 p-7 rounded border border-gray-300 bg-white'>
        <h2 className='font-medium text-2xl text-gray-800 mb-3'>Movimientos Recientes</h2>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-600 ">
            <thead className="text-sm text-gray-700 capitalize bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                      Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                      Producto
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                      Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                      Cantidad
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                      Motivo
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                      Usuario
                  </th>
                    
                </tr>
            </thead>
            <tbody>
              {data_movements?.map((item, index) => (
                <tr key={index}>
                  <th scope="col" className="px-6 py-3 font-medium text-gray-700 ">
                    {item.fecha}
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium text-gray-700">
                    {getProductName(item.idProducto)}
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium flex items-center">
                    {item.tipo === 'salida' ? 
                    (
                      <>
                        <Minus size={15} color='#bf4040' />
                        <span className='text-[#bf4040]'>Salida</span> 
                      </>
                    ): 
                    (

                      <>
                        <Plus size={15} color='#45a179' />
                        <span className='text-[#45a179]'>Entrada</span>
                      </>
                    )}

                  </th>
                  <th scope="col" className="px-6 py-3 font-medium text-gray-700">
                    {item.cantidad}
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium text-gray-700">
                    {item.motivo}
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium text-gray-700">
                    Cajero 1
                  </th>
                </tr>

              ))}


              
                
            </tbody>
          </table>
        </div>
      </div>        

      <ModalMovimientos
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        idProducto={idProducto}
      />           
    </>
  )
}
