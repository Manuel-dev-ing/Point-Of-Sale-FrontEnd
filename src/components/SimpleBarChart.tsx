import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { ResumenVenta } from '../types';

// #region Sample data
const salesByMonth = [
  { month: "Ene", ventas: 45000, ingresos: 950000 },
  { month: "Feb", ventas: 42000, ingresos: 880000 },
  { month: "Mar", ventas: 48000, ingresos: 1020000 },
  { month: "Abr", ventas: 51000, ingresos: 1080000 },
  { month: "May", ventas: 49000, ingresos: 1040000 },
  { month: "Jun", ventas: 53000, ingresos: 1120000 },
];

type SimpleBarChartProps = {
  data : ResumenVenta[]
}

export default function SimpleBarChart({data } : SimpleBarChartProps) {
  return (
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
      <Bar yAxisId="left" dataKey="ventas" fill="#4573a1" name="Ventas" />
      <Bar yAxisId="right" dataKey="ingresos" fill="#45A167" name="Ingresos ($)" />
    </BarChart>
  )
}










