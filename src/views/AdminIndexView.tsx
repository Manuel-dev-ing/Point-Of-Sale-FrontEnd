import { DollarSign, Package, Plus, Receipt, ShoppingCart, TrendingUp, TriangleAlert, Users } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SimpleBarChart from '../components/SimpleBarChart'
import ExampleBarChart from '../components/ExampleBarChart'
import { useQueries, useQuery } from '@tanstack/react-query'
import { getLowStockProduts, getResumeDashboard } from '../services/DashboardAPI'
import { format, weekEnd, weekStart } from '@formkit/tempo'
import { getResumenVentas } from '../services/ReportsAPI'
import { calcularIVA } from '../helpers'
import type { ResumenVenta } from '../types'

export default function AdminIndexView() {
  const [fechaInicio, setfechaInicio] = useState<string>(format(weekStart(new Date()), "YYYY-MM-DD", "en"))
  const [fechaFin, setFechaFin] = useState<string>(format(weekEnd(new Date()), "YYYY-MM-DD", "en"))
  
  const {data: dataResumenVentas, isLoading: isLoadingResumenVentas } = useQuery({
    queryKey: ['resumenVentas', { fechaInicio, fechaFin }],
    queryFn: getResumenVentas,
    enabled: !!fechaInicio && !!fechaFin

  })
  
  const {data: dataLowProducts, isLoading: isLoadingLowProducts} = useQuery({
    queryKey: ['LowStockProducts'],
    queryFn: getLowStockProduts
  })

  console.log(dataLowProducts);
  

  const formatWeekSalesResume = (dataResumenVentas: ResumenVenta[] | undefined) => {
    const resultado = dataResumenVentas?.map(item => {
      const date = format(item.fecha, "ddd", "es") 
      const total = (calcularIVA(item.ingresos) + item.ingresos).toFixed(2)
      return {...item, ingresos: Number(total), fecha: date}
    })

    return resultado
  }

  const { data, isLoading } = useQuery({
    queryFn: getResumeDashboard,
    queryKey: ['ResumeDashboard']
  })

  return (
    <>
      <section className='flex gap-4 mb-5'>
        <div className='bg-white border border-gray-300 w-60 p-3 rounded'>
          <div className='flex items-center justify-between px-2 mb-2'>
            <p className='capitalize text-sm text-gray-700 font-medium'>Ventas Hoy</p>
            <ShoppingCart
              size={15}
              color='#6e7e95'
            />
          </div>
          <span className='font-bold px-2 text-2xl text-gray-800'>{data?.ventas}</span>
        </div>

        <div className='bg-white border border-gray-300 w-60 p-3 rounded'>
          <div className='flex items-center justify-between px-2 mb-2'>
            <p className='capitalize text-sm text-gray-700 font-medium'>Ingresos Hoy</p>
            <DollarSign
              size={15}
              color='#6e7e95'
            />
          </div>
          <span className='font-bold px-2 text-2xl text-gray-800'>${data?.ingresos}</span>
        </div>

        <div className='bg-white border border-gray-300 w-60 p-3 rounded'>
          <div className='flex items-center justify-between px-2 mb-2'>
            <p className='capitalize text-sm text-gray-700 font-medium'>Productos</p>
            <Package
              size={15}
              color='#6e7e95'
            />
          </div>
          <span className='font-bold px-2 text-2xl text-gray-800'>{data?.productos}</span>
        </div>

        <div className='bg-white border border-gray-300 w-60 p-3 rounded'>
          <div className='flex items-center justify-between px-2 mb-2'>
            <p className='capitalize text-sm text-gray-700 font-medium'>Clientes Hoy</p>
            <Users
              size={15}
              color='#6e7e95'
            />
          </div>
          <span className='font-bold px-2 text-2xl text-gray-800'>{data?.clientes}</span>
        </div>

      </section>

      <section className='bg-white border border-gray-300 p-4 rounded mb-5'>
        <p className='capitalize font-medium text-xl text-gray-800 mb-3'>Acciones rapidas</p>
        <div className='flex gap-3'>
          <Link to={'/shopping'} target='_blank' type="button" className="flex items-center gap-3 border w-80 text-white cursor-pointer btn-blue font-medium rounded text-sm px-5 py-2.5 " >
              <Receipt size={17} />
              <div className='flex flex-col'>
                <p>Nueva Venta</p>
                <p className='text-gray-300 font-medium'>Procesar Venta</p>

              </div>

          </Link>
          <Link to={'/products/add'} type="button" className="flex items-center gap-3 border w-80 text-white cursor-pointer bg-[#dae9e2] hover:bg-[#e6ebef] font-medium rounded text-sm px-5 py-2.5 " >
            <Plus size={17} color='#344256' />
            <div className='flex flex-col'>
              <p className='text-gray-800 capitalize'>Agregar producto</p>
              <p className='text-gray-600 font-medium capitalize'>nuevo producto</p>
            </div>
          </Link>
          <Link to={'/reports'} type="button" className="flex items-center gap-3 border w-80 text-white cursor-pointer bg-[#dae9e2] hover:bg-[#e6ebef] font-medium rounded text-sm px-5 py-2.5 " >
            <TrendingUp size={17} color='#344256' />
            <div className='flex flex-col'>
              <p className='text-gray-800 capitalize'>ver reportes</p>
              <p className='text-gray-600 font-medium capitalize'>analisis ventas</p>
            </div>
          </Link>
        </div>
      </section>

      <section className='flex justify-between'>
        <div className='bg-white border border-gray-300 rounded w-[511px]'>
          <p className='font-medium text-xl text-gray-800 mb-5 px-10 pt-4'>Ventas de la Semana</p>
          <SimpleBarChart data={formatWeekSalesResume(dataResumenVentas)} isVissible={false} />
          {/* <ExampleBarChart /> */}
        </div>
        <div className='bg-white border border-gray-300 p-4 rounded w-[511px] h-96 overflow-y-auto'>
          <div className='flex justify-between'>
            <p className='flex items-center gap-3 font-medium text-xl text-gray-800 capitalize'>
              <TriangleAlert size={18} color='#ffc107' />
              Stock bajo
            </p>
            <Link to={'/products/add'} type="button" className="border bg-white border-gray-200 py-2 px-2.5 rounded hover:bg-[#d1e7dd] flex items-center gap-3 text-gray-700 font-medium text-sm cursor-pointer capitalize">
              ver todo
            </Link>
          </div>
          {dataLowProducts?.map((item, index) => (
            <div key={index} className='bg-[#e6ebef] px-4 py-3 mt-5  rounded '>
              <div className='flex justify-between'>
                <p className='text-gray-800 font-semibold text-base'>{item.nombre}</p>
                <span className='font-bold text-lg text-yellow-500'>{item.stockInicial  }</span>
              </div>
              <div className='flex justify-between'>
                <p className='text-gray-500 text-sm capitalize'>stock restante</p>
                <span className='text-gray-500 text-sm'>unidades</span>
              </div>
            </div>
          ))}

        </div>

      </section>


    </>
  )
}
