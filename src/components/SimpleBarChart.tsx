import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { ResumenVenta } from '../types';

type SimpleBarChartProps = {
  data: ResumenVenta[]
  isVissible: boolean
}

export default function SimpleBarChart({data, isVissible } : SimpleBarChartProps) {
  return (
    <>
      {data?.length === 0 ? (
        
        <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 " role="alert">
          <span className="font-medium">No hay ventas</span> que mostrar.
        </div>

      ) : (
        
        <BarChart
          height={400}
          style={{ width: '100%' }}
          responsive
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={"fecha"} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          {isVissible ? (
            <Bar yAxisId="left" dataKey="ventas" fill="#4573a1" name="Ventas" />
          ) : (
            <></>
          )}
          
          <Bar yAxisId="right" dataKey="ingresos" fill="#45A167" name="Ingresos ($)" />
        </BarChart>

      )}
    </>
    

  )
}










