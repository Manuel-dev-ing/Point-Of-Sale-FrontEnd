import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import type { ResumenVenta } from '../types';
import Spinner from './Spinner';




type LineChartsProps = {
  data : ResumenVenta[]
}

// #endregion
export default function LineCharts({data} : LineChartsProps) {
  // console.log("Line Charts: ");
  
  // console.log(data);
  

  return (
    <>
      {data.length === 0 ? (
        <>
          {/* spinner */}
          {/* <Spinner />  */}
          <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 " role="alert">
            <span className="font-medium">No hay ventas</span> que mostrar.
          </div>
        </>

      ): 
      (
        <>
        
          <LineChart style={{ width: '100%', maxWidth: '900px', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
          responsive
          data={data}
          margin={{
            top: 3,
            right: 0,
            left: 0,
            bottom: 3,
          }}
        >
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis className='text-sm' dataKey="fecha" />
          <YAxis className='text-sm' width="auto" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ingresos" stroke="#8884d8" activeDot={{ r: 5  }} />
          <Line type="monotone" dataKey="ventas" stroke="#82ca9d" />
          </LineChart>
        
        </>
      )}
    
    </>


  )
}
