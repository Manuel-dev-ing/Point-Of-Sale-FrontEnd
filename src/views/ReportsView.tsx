import { ChartColumn, DollarSign, Funnel, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "@formkit/tempo";
import LineCharts from "../components/LineCharts";
import PieChartWithCustomized from "../components/PieChartWithCustomized";
import SimpleBarChart from "../components/SimpleBarChart";
import { useQuery } from "@tanstack/react-query";
import { getResumenVentas, getResumeStatistics, getTopProducts, getTopUsuarios, ventasCategorias } from "../services/ReportsAPI";
import { calcularIVA, establecerPeriodo, formatSalesResume, getMonths, } from "../helpers";
import type { ResumenVenta } from "../types";
import CardStatistics from "../components/CardStatistics";

import TableTopProducts from "../components/TableTopProducts";
import TableTopUsers from "../components/TableTopUsers";
import { usePosNetStore } from "../store";

const reportes = ['ventas']
const periodos = ['semana', 'mes', 'trimestre', 'anio']
const arrTopProducts = ['Producto', 'Ventas', 'Ingresos']
const arrTopCajeros = ['Cajero', 'Ventas', 'Ingresos']

export default function ReportsView() {
  const fechaInicio = usePosNetStore((state) => state.fechaInicio)
  const setFechaInicio = usePosNetStore((state) => state.setFechaInicio)
  
  const fechaFin = usePosNetStore((state) => state.fechaFin)
  const setFechaFin = usePosNetStore((state) => state.setFechaFin)
  
  const periodo = usePosNetStore((state) => state.periodo)

  const [tipoReporte, setTipoReporte] = useState<string>('ventas')
  const [tipoPeriodos, setTipoPeriodos] = useState<string>('semana')

  const [dataChart, setDataChart] = useState<ResumenVenta[]>([])

  const {data, isError, isLoading} = useQuery({
    queryKey: ['resumenVentas', { fechaInicio, fechaFin }],
    queryFn: getResumenVentas,
    enabled: !!fechaInicio && !!fechaFin

  })
  
  const { data: statisticsData, isLoading: isLoadingStatistics } = useQuery({
    queryFn: getResumeStatistics,
    queryKey: ['getResumeStatistics']
  })

  const { data: topProductsData, isLoading: isLoadingTopProducts } = useQuery({
    queryFn: getTopProducts,
    queryKey: ['getTopProducts']
  })

  const { data: dataTopUsuarios, isLoading: isLoadingTopUsuarios } = useQuery({
    queryFn: getTopUsuarios,
    queryKey: ['getTopUsuarios']

  })
  
  const { data: dataVentasCategorias, isLoading: isLoadingVentasCategorias } = useQuery({
    queryFn: ventasCategorias,
    queryKey: ['ventasCategorias']
  })
  
  
  if (tipoPeriodos) {
    establecerPeriodo(tipoPeriodos)
  }

  
  useEffect(() => {
    if (!data?.length) return;
    
    if (periodo === 'semana') {

      const resultado = data.map(item => {
        const date = format(item.fecha, "ddd", "es") 
        const total = (calcularIVA(item.ingresos) + item.ingresos).toFixed(2)
        return {...item, ingresos: Number(total), fecha: date}
      })
      
      setDataChart(resultado)
      
    } else if(periodo === 'trimestre'){
      const arr_months = getMonths(data)
      
      const arr = formatSalesResume(data, arr_months)
      setDataChart(arr)


    } else if(periodo === 'anio'){
      
      const arr_months_anio = getMonths(data)

      const arr = formatSalesResume(data, arr_months_anio)

      setDataChart(arr)
    }
        
  }, [data, periodo])



  const handleSelectTipo = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setTipoReporte(e.target.value)
  }

  const handleSelectPeriodo = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoPeriodos(e.target.value)
  }

  const handleFechaFin = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setFechaFin(e.target.value)
    
  }

  const handleFechaInicio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFechaInicio(e.target.value)
  }

  function mostrarTipoPeriodo(periodo : string) : string {
    
    if (periodo === 'semana') {

      return 'dia'
    
    }else if(periodo === 'personalizado'){
      
      return 'mes'
    }

    return periodo
  }

  return (
    <>
        <h1 className="text-2xl text-gray-700 font-bold">Reportes y Analisis</h1>
        <div className="border border-gray-300 bg-white p-5 rounded-md mt-5">

            <div className="flex items-center gap-3">
              <Funnel size={20} color="#344256" />
              <h2 className="text-gray-700 font-semibold text-2xl">Filtros de Reporte</h2>

            </div>

            <div className="flex gap-3 mt-5">
              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="tipo">Tipo de Reporte</label>
                  <select className="capitalize mt-1 border rounded-md text-gray-700 text-sm py-2 px-3 w-60 bg-[#fafafa] border-gray-300 focus:border-[#5781aa] focus:ring-[#5781aa] focus:border-2" id="tipo"
                  value={tipoReporte}
                  onChange={handleSelectTipo}>
                    {reportes.map((item, index) => (
                      <option key={index} value={item}>{item}</option>
                    ))}
              
                  </select>
              </div>

              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="periodo">Periodo</label>
                  <select className="capitalize mt-1 border rounded-md text-gray-700 text-sm py-2 px-3 w-60 bg-[#fafafa] border-gray-300 focus:border-[#5781aa] focus:border-2" id="periodo"
                  value={tipoPeriodos}
                  onChange={handleSelectPeriodo}>
                    {periodos.map((item, index) => (
                      <option key={index} value={item}>
                        { item === 'personalizado' ? item : 'este '+item  }
                      </option>

                    ))}
                
                  </select>
              </div>

              {tipoPeriodos === 'personalizado' && (
                <>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-800">Fecha Inicio</label>
                    <input className="capitalize mt-1 border rounded-md text-gray-700 text-sm py-2 px-3 w-60 bg-[#fafafa] border-gray-300 focus:border-[#5781aa] focus:ring-[#5781aa] focus:border-2" type="date" 
                    onChange={handleFechaInicio}
                    />   

                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-800">Fecha Fin</label>
                    <input className="capitalize mt-1 border rounded-md text-gray-700 text-sm py-2 px-3 w-60 bg-[#fafafa] border-gray-300 focus:border-[#5781aa] focus:ring-[#5781aa] focus:border-2" type="date" 
                    onChange={handleFechaFin}
                    />   

                  </div>
                
                
                </>
              )}


            </div>


        </div>

        <div className='flex justify-between gap-5'>

          <CardStatistics label="Ventas Totales" value={statisticsData?.ventas} Icon={ChartColumn} iconColor="#4573a1" />

          <CardStatistics label="Ingresos Totales" value={statisticsData?.ingresos} Icon={DollarSign} iconColor="#44a166" />

          <CardStatistics label="Unidades Totales" value={statisticsData?.unidadesTotales} Icon={TrendingUp} iconColor="#e8ba30" />

          <CardStatistics label="Valor Inventario" value={statisticsData?.valorInventario } Icon={Users} iconColor="#667384" />    
      
        </div> 

        <div className="mt-5">

          <div className="border border-gray-300 bg-white p-2 w-full rounded-md">
            <h3 className="text-gray-800 text-xl font-semibold">
              Ventas por <span className="capitalize">{ mostrarTipoPeriodo(tipoPeriodos)}</span> 
              <div className="mt-5 ">
                <LineCharts data={dataChart} />

              </div>
            </h3>
          </div>

          <div className="border border-gray-300 bg-white p-3 w-full rounded-md mt-3">
            <h3 className="text-gray-800 text-xl font-semibold">Ventas por Categoria</h3>
            <div className="mt-5 flex justify-center">
              <PieChartWithCustomized data={dataVentasCategorias} />
            </div>

          </div>

        </div>

        <div className="flex gap-4 mt-5">

            <div className="border border-gray-300 bg-white p-3 w-[500px] rounded-md">
              <h3 className="text-gray-800 text-xl font-semibold capitalize py-2 px-2">Productos mas vendidos</h3>
              <div className="relative overflow-x-auto mt-2">
                <TableTopProducts dataThead={arrTopProducts} data={topProductsData} /> 

              </div>

            </div>
            <div className="border border-gray-300 bg-white p-3 w-[500px] rounded-md">
              <h3 className="text-gray-800 text-xl font-semibold py-2 px-2">Rendimiento Por Cajero</h3>
              <TableTopUsers data={dataTopUsuarios} dataThead={arrTopCajeros} />
              
                
            </div>

        </div>

        <div className="border border-gray-300 bg-white p-3 mt-5 rounded-md">
          <h3 className="text-gray-800 text-xl font-semibold capitalize">
            Comparativa de Ventas e Ingresos
          </h3>

          <div className="mt-5">
            <SimpleBarChart data={dataChart} isVissible={true} />
          </div>    
            

        </div>


    </>
  )
}


