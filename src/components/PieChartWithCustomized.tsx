import React from 'react'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import type { VentaCategoria } from '../types';
import Spinner from './Spinner';


type PieChartWithCustomizedProps = {
  isAnimationActive?: boolean
  data? : VentaCategoria[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9354ef'];

export default function PieChartWithCustomized({ isAnimationActive = true, data }: PieChartWithCustomizedProps) {
  console.log(data);
  
  
  return (
    <>
      {data?.length ? (
        <PieChart width={700} height={250}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(data) => `${data.categoria +' ' + '$'+data.value}`}
            fill="#8884d8"
            dataKey="value"
            isAnimationActive={isAnimationActive}
            outerRadius={100}
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>

      ) : (

        <Spinner />
      )}
    
    </>
  
  )
}






