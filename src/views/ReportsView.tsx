import { ChartColumn, DollarSign, Funnel, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { addMonth, format, monthEnd, monthStart, weekEnd, weekStart, yearEnd, yearStart } from "@formkit/tempo"
import LineCharts from "../components/LineCharts";
import PieChartWithCustomized from "../components/PieChartWithCustomized";
import SimpleBarChart from "../components/SimpleBarChart";
import { useQuery } from "@tanstack/react-query";
import { getResumenVentas, getTopProducts, getTopUsuarios, ventasCategorias } from "../services/ReportsAPI";
import { calcularIVA } from "../helpers";
import { map } from "zod";
import type { ResumenVenta } from "../types";

const reportes = ['ventas']
const periodos = ['semana', 'mes', 'trimestre', 'anio']

export default function ReportsView() {
  const [tipoReporte, setTipoReporte] = useState<string>('ventas')
  const [tipoPeriodos, setTipoPeriodos] = useState<string>('semana')
  const [fechaInicio, setFechaInicio] = useState<string>()
  const [fechaFin, setFechaFin] = useState<string>()
  const [periodo, setPeriodo] = useState<string>('')
  const [dataChart, setDataChart] = useState<ResumenVenta[]>([])
  
  const {data, isError, isLoading} = useQuery({
    queryKey: ['resumenVentas', { fechaInicio, fechaFin }],
    queryFn: getResumenVentas,
    enabled: !!fechaInicio && !!fechaFin

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
  
  console.log(dataVentasCategorias);
  

  useEffect(() => {
    console.log("Use Effect");
    
    switch (tipoPeriodos) {
      case 'semana':
      
        let week_start = format(weekStart(new Date()), "YYYY-MM-DD", "en")
        let week_end = format(weekEnd(new Date()), "YYYY-MM-DD", "en") 
        setPeriodo('semana')
        setFechaInicio(week_start)
        setFechaFin(week_end)

        break;

      case 'mes':
        let month_start = format(yearStart(new Date()), "YYYY-MM-DD", "en")

        let month_end = format(yearEnd(new Date()), "YYYY-MM-DD", "en")
        setPeriodo('mes')
        setFechaInicio(month_start)
        setFechaFin(month_end)
        
        break;
      case 'trimestre':
        let startTrim = format(addMonth(new Date(), -3), "YYYY-MM-DD", "en");
        let lastTrim = format(monthStart(new Date()), "YYYY-MM-DD", "en")
        setPeriodo('trimestre')
        setFechaInicio(startTrim)
        setFechaFin(lastTrim)

        break;
      case 'anio':
        let year_start = format(yearStart(new Date()), "YYYY-MM-DD", "en")

        let year_end = format(yearEnd(new Date()), "YYYY-MM-DD", "en") 
        setFechaInicio(year_start)
        setFechaFin(year_end)
        setPeriodo('anio')
        break;

      default:
        break;
    }
  }, [tipoPeriodos])

  useEffect(() => {
    console.log("useEffect 2");
     
    if (!data?.length) return;
    
    if (periodo === 'semana') {

      const resultado = data.map(item => {
        const date = format(item.fecha, "ddd", "es") 
        const total = (calcularIVA(item.ingresos) + item.ingresos).toFixed(2)
        return {...item, ingresos: Number(total), fecha: date}
      })
      
      setDataChart(resultado)
      
    } else if(periodo === 'trimestre'){
      console.log("trimestre");
      const arr_months = getMonths(data)
      
      const arr = formatSalesResume(data, arr_months)
      console.log(arr);


      setDataChart(arr)


    } else if(periodo === 'anio'){
      console.log("ANIO");
      console.log(data);
      
      const arr_months_anio = getMonths(data)

      const arr = formatSalesResume(data, arr_months_anio)

      console.log(arr);
      setDataChart(arr)

    }

    console.log("Fin useEffect 2");

  }, [data, periodo])

  const getMonths = (data : ResumenVenta[]) => {
    let arr_months : string[] = []        
    data.map((item, index) => {
      const date = format(item.fecha, "MM", "es") 
      if (!arr_months.includes(date)) {
          arr_months.push(date)
      }
    })

    return arr_months;
  }

  const formatSalesResume = (data : ResumenVenta[], arr : string[]) => {
    let arr_salesResume : ResumenVenta[] = []
    let ingresos: number = 0
    let ventas: number = 0
    let fecha: string = ''

    arr.forEach(element => {
      const result = data.filter(x => format(x.fecha, "MM", "es").includes(element))
      
      result.forEach(item => {
        ingresos += item.ingresos
        ventas += item.ventas
      });
        
      // console.log({ingresos, ventas, fecha: format(result[0].fecha, "MMM", "es")  });
      const total = (calcularIVA(ingresos) + ingresos).toFixed(2)
      const sales = ventas.toFixed(2) 
      let obj = {ingresos: Number(total), ventas: Number(sales), fecha: format(result[0].fecha, "MMM", "es")  }
      arr_salesResume.push(obj)

    });

    return arr_salesResume  
  }

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
              
          <div className='flex items-center gap-2 border border-gray-300 p-3 bg-white mt-4 rounded w-64'>
            <ChartColumn size={20} color='#4573a1' />
            <div className='flex flex-col'>
                <p className='text-gray-500 text-sm font-normal'>Ventas Totales</p>
                <span className='font-bold text-2xl text-gray-700'>{1523}</span>
            </div>
          </div>
          <div className='flex items-center gap-2 border border-gray-300 p-3 bg-white mt-4 rounded w-64'>
            <DollarSign size={20} color='#44a166' />
            <div className='flex flex-col'>
              <p className='text-gray-500 text-sm font-normal'>Ingresos Totales</p>
              <span className='font-bold text-2xl text-gray-700'>{3}</span>
            </div>
          </div>
          <div className='flex items-center gap-2 border border-gray-300 p-3 bg-white mt-4 rounded w-64'>
            <TrendingUp size={20} color='#e8ba30' />
            <div className='flex flex-col'>
              <p className='text-gray-500 text-sm font-normal'>Unidades Totales</p>
              <span className='font-bold text-2xl text-gray-700 '>{15256.23}</span>
            </div>
          </div>
          <div className='flex items-center gap-2 border border-gray-300 p-3 bg-white mt-4 rounded w-64'>
            <Users size={20} color='#667384' />
            <div className='flex flex-col'>
              <p className='text-gray-500 text-sm font-normal'>Valor Inventario</p>
              <span className='font-bold text-2xl text-gray-700'>{56336.25}</span>
            </div>
          </div>
      
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
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-sm text-gray-600  capitalize bg-gray-50 ">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Producto
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Ventas
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Ingresos
                            </th>
                            
                        </tr>
                    </thead>
                    <tbody>
                      {topProductsData?.map((item, index) => (
                        <tr key={index} className="bg-white border-b border-gray-200">
                          <td className="px-6 py-4">
                              {item.nombre}
                          </td>
                          <td className="px-6 py-4">
                              {item.cantidad}
                          </td>
                          <td className="px-6 py-4">
                              ${item.ingresos}
                          </td>

                        </tr>
                      ))}


                    </tbody>
                </table>
              </div>

            </div>
            <div className="border border-gray-300 bg-white p-3 w-[500px] rounded-md">
                <h3 className="text-gray-800 text-xl font-semibold py-2 px-2">Rendimiento Por Cajero</h3>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-sm text-gray-600  capitalize bg-gray-50 ">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Cajero
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Ventas
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Ingresos
                            </th>
                            
                        </tr>
                    </thead>
                    <tbody>
                      {dataTopUsuarios?.map((item, index) => (
                        <tr key={index} className="bg-white border-b border-gray-200">
                          <td className="px-6 py-4">
                              {item.nombre + ' ' + item.primerApellido}
                          </td>
                          <td className="px-6 py-4">
                              {item.ventas}
                          </td>
                          <td className="px-6 py-4">
                              ${item.total}
                          </td>

                        </tr>
                      ))}


                    </tbody>
                </table>
            </div>

        </div>

        <div className="border border-gray-300 bg-white p-3 mt-5 rounded-md">
          <h3 className="text-gray-800 text-xl font-semibold capitalize">
            Comparativa de Ventas e Ingresos
          </h3>

          <div className="mt-5">
            <SimpleBarChart data={dataChart} />
          </div>    
            

        </div>


    </>
  )
}


