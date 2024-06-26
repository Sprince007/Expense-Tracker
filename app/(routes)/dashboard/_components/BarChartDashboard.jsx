import React from 'react';
import { AreaChart, Area, Line, CartesianGrid, Tooltip, XAxis, YAxis, Legend, ResponsiveContainer, Label } from 'recharts';

function formatNumber(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function StylishCombinedChart({ budgetList }) {
  const formattedBudgetList = budgetList.map(item => ({
    ...item,
    totalSpent: parseFloat(item.totalSpent),
    amount: parseFloat(item.amount)
  }));

  return (
    <div className='border rounded-lg p-5 bg-gradient-to-r from-blue-100 to-purple-100'>
      <h2 className='font-bold text-lg p-1 text-center text-purple-600'>Activity</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedBudgetList}
            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorTotalSpent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F51720" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F51720" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A16AE8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#A16AE8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }}>
            <Label value="Budgets" offset={-32} position="insideBottom" style={{ fontWeight: 'bold' }} />
             </XAxis>

             <YAxis tickFormatter={formatNumber} tick={{ fontSize: 10 }}>
             <Label value="FCFA" angle={-90} position="insideLeft" style={{ fontWeight: 'bold', textAnchor: 'middle' }} />
              </YAxis>

            <Tooltip formatter={(value) => formatNumber(value)} />
            <Legend />
            <Area type="monotone" dataKey="totalSpent" stroke="#F51720" fillOpacity={1} fill="url(#colorTotalSpent)" />
            <Area type="monotone" dataKey="amount" stroke="#A16AE8" fillOpacity={1} fill="url(#colorAmount)" />
            <Line type="monotone" dataKey="totalSpent" stroke="#ff7300" />
            <Line type="monotone" dataKey="amount" stroke="#387908" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StylishCombinedChart;
