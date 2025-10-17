import { Boxes, ChartColumn, Computer, LogOut, PackageX, PanelLeft, Plus, ReceiptText, ShoppingBasket, ShoppingCart, Users, Warehouse } from 'lucide-react'
import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { usePosNetStore } from '../store'

export default function PublicLayout() {
  const setIsOpen = usePosNetStore((state) => state.setIsOpen)

  const dataPendingProducts = usePosNetStore((state) => state.dataPendingProducts)

  

  return (
    <>
      <div className='bg-[#fafafa] h-screen border '>
        <nav className="bg-white border-b-1 border-gray-200 w-full">
          <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">

                <a href='/' className="self-center font-semibold whitespace-nowrap text-lg text-gray-700">
                  Sistema de Punto de Venta
                </a>
              </div>
            
              <div className="hidden w-full md:block md:w-auto border border-gray-300 py-2 px-2 rounded " id="navbar-default">
                  <p className='font-semibold text-blue-950'>Le atiende: <span className='font-medium text-gray-700'>Sr. Gonzales</span></p>
              </div>
          </div>
        </nav>
        <main className=''>
          <div className='border-b-1 border-gray-200 p-3 flex justify-between bg-white'>
            <div className='flex space-x-2'>
              <Link to={'/products/add'} type="button" className="border bg-gray-100 border-gray-200 py-2 px-2.5 rounded hover:bg-gray-200 flex items-center gap-3 text-gray-700 font-medium text-sm cursor-pointer">
                  <Users size={17} />
                  Clientes
              </Link>
              <Link to={'/products/add'} type="button" className="border bg-gray-100 border-gray-200 py-2 px-2.5 rounded hover:bg-gray-200 flex items-center gap-3 text-gray-700 font-medium text-sm cursor-pointer">
                  <ShoppingBasket size={17} />
                  Productos
              </Link>
              <Link to={'/products/add'} type="button" className="border bg-gray-100 border-gray-200 py-2 px-2.5 rounded hover:bg-gray-200 flex items-center gap-3 text-gray-700 font-medium text-sm cursor-pointer">
                  <Warehouse size={17} />
                  Inventario
              </Link>
              <Link to={'/products/add'} type="button" className="border bg-gray-100 border-gray-200 py-2 px-2.5 rounded hover:bg-gray-200 flex items-center gap-3 text-gray-700 font-medium text-sm cursor-pointer">
                  <Computer size={17} />
                  Corte Caja
              </Link>
              <Link to={'/products/add'} type="button" className="border bg-gray-100 border-gray-200 py-2 px-2.5 rounded hover:bg-gray-200 flex items-center gap-3 text-gray-700 font-medium text-sm cursor-pointer">
                  <ShoppingCart size={17} />
                  Compras
              </Link>
              <Link to={'/products/add'} type="button" className="border bg-gray-100 border-gray-200 py-2 px-2.5 rounded hover:bg-gray-200 flex items-center gap-3 text-gray-700 font-medium text-sm cursor-pointer">
                  <ReceiptText size={17} />
                  Facturas
              </Link>
              <Link to={'/products/add'} type="button" className="border bg-gray-100 border-gray-200 py-2 px-2.5 rounded hover:bg-gray-200 flex items-center gap-3 text-gray-700 font-medium text-sm cursor-pointer">
                  <ChartColumn size={17} />
                  Reportes
              </Link>
              {dataPendingProducts.length > 0 && (
                <button type="button" className="border bg-gray-100 border-gray-200 py-2 px-2.5 rounded hover:bg-gray-200 flex items-center gap-3 text-gray-700 font-medium text-sm cursor-pointer"
                onClick={() => setIsOpen(true)}>
                  <Boxes size={17} />
                  Productos Pendientes
                </button>

              )}


            </div>
          
            <Link to={'/products/add'} type="button" className="border bg-gray-100 border-gray-200 py-2 px-2.5 rounded hover:bg-gray-200 flex items-center gap-3 text-gray-700 font-medium text-sm cursor-pointer">
                <LogOut size={17} />
                Salir
            </Link>
          </div>
          <Outlet />
        </main>

      </div>
      <ToastContainer 
          pauseOnHover={false}
          pauseOnFocusLoss={false}
      />
    </>
  )
}
