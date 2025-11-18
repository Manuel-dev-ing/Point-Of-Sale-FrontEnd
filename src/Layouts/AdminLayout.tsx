
import { ChartColumn, FolderOpen, LayoutDashboard, LogOut, Package, PanelLeft, Settings, ShoppingBag, ShoppingCart, Users, Warehouse } from 'lucide-react'
import { ToastContainer } from 'react-toastify'

import { Link, Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <>
        <div className='bg-gray-50 w-full h-screen'>
            <div className='relative bg-gray-50'>
                <aside id="default-sidebar" className="flex flex-col fixed top-0 left-0 z-40 w-64 transition-transform -translate-x-full sm:translate-x-0 border h-screen bg-gray-50 border-gray-300" aria-label="Sidebar">
                        <div>
                            <div className='border-gray-300 border-b-1 py-3 px-3'>
                                <a href='/' className='font-medium text-gray-800 text-xl'>TiendaPOS</a>
                            </div>

                            <div className='px-3 py-4 '>
                                <div>
                                    <p className='capitalize text-gray-500 text-xs font-medium'>Modulos Principales</p>
                                </div>

                                <ul className="space-y-1 font-medium">
                                    <li>
                                    
                                        <Link to={'/'} className="flex items-center p-2 rounded-lg hover:bg-gray-100  group">
                                            <LayoutDashboard
                                                size={15}
                                            />
                                            <span className="ms-3 text-sm font-normal">Dashboard</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'/sales'} target='_blank' className="flex items-center p-2 rounded-lg hover:bg-gray-100  group">
                                            <ShoppingCart
                                                size={15}
                                            />
                                            <span className="ms-3 text-sm font-normal">Ventas</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'/shopping'} target='_blank' className="flex items-center p-2 rounded-lg hover:bg-gray-100  group">
                                            <ShoppingBag
                                                size={15}
                                            />
                                            <span className="ms-3 text-sm font-normal">Compras</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'/products'} className="flex items-center p-2 rounded-lg hover:bg-gray-100  group">
                                            <Package
                                                size={15}
                                            />
                                            <span className="ms-3 text-sm font-normal">Productos</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'/categories'} className="flex items-center p-2 rounded-lg hover:bg-gray-100  group">
                                            <FolderOpen
                                                size={15}
                                            />
                                            <span className="ms-3 text-sm font-normal">Categorias</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'/clients'} className="flex items-center p-2 rounded-lg hover:bg-gray-100  group">
                                            <Users
                                                size={15}
                                            />
                                            <span className="ms-3 text-sm font-normal">Clientes</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'/inventory'} className="flex items-center p-2 rounded-lg hover:bg-gray-100  group">
                                            <Warehouse
                                                size={15}
                                            />
                                            <span className="ms-3 text-sm font-normal">Inventario</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'/reports'} className="flex items-center p-2 rounded-lg hover:bg-gray-100  group">
                                            <ChartColumn
                                                size={15}
                                            />
                                            <span className="ms-3 text-sm font-normal">Reportes</span>
                                        </Link>
                                    </li>
                                    
                                
                                </ul>

                                <div className='mt-3'>
                                    <p className='capitalize text-gray-500 text-xs font-medium'>Administracion</p>
                                </div>

                                <ul className="space-y-1 font-medium">
                               
                                    <li>
                                        <Link to={'/users'} className="flex items-center p-2 rounded-lg hover:bg-gray-100  group">
                                            <Settings
                                                size={15}
                                            />
                                            <span className="ms-3 text-sm font-normal">Usuarios</span>
                                        </Link>
                                    </li>
                                
                                </ul>
                            </div>

                        </div>
                        <div className="flex-grow"></div>

                        <div className='py-4 px-4 border-t-1 border-gray-300 flex items-center gap-3'>
                            <LogOut
                                size={18}
                                color='#667384'
                                strokeWidth={3}
                            />

                            <p className='font-medium text-gray-700 text-sm'>Cerrar Sesion</p>
                        </div>
                </aside>

                <nav className="bg-white shadow-md fixed top-0 right-0 w-95 z-50">
                    <div className="flex items-center justify-between p-4">
                        <div  className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className='p-1 rounded cursor-pointer hover-panel'>
                                <PanelLeft 
                                    size={18}
                                />
                            </div>

                            <a href='/' className="self-center font-semibold whitespace-nowrap text-lg text-gray-700">Sistema de Punto de Venta</a>
                        </div>
                      
                        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                            
                        </div>
                    </div>
                </nav>

            </div>


            <div className="p-4 h-screen sm:ml-72 bg-gray-50">

                <div className='mt-16'>
                  
                    <Outlet />
                </div>
            </div>
        </div>
      
        <ToastContainer 
            pauseOnHover={false}
            pauseOnFocusLoss={false}
        />
    
    
    
    </>
  )
}
