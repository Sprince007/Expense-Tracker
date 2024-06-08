import React from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function BarChartDashboard({budgetList}) {
  return (
    <div className='border rounded-lg p-5'>
        <h2 className='font-bold text-lg p-1'>Activity</h2>
        <ResponsiveContainer width={'80%'} height={300} >
          <BarChart
             
              data={budgetList}
              margin={{
                  top:7
              }}
            
          >
              <XAxis dataKey='name' />
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Bar dataKey='totalSpent' stackId="a" fill='#FD49A0'/>
              <Bar dataKey='amount' stackId="a" fill='#A16AE8'/>
          </BarChart>
        </ResponsiveContainer>
    </div>
  )
}

export default BarChartDashboard