"use client";
import React from 'react';
import CreateBudget from './CreateBudget';
import BudgetItem from './BudgetItem';

function BudgetList({ budgets, refreshData }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      <CreateBudget refreshData={refreshData} />
      {budgets?.length > 0 ? budgets.map((budget, index) => (
        <BudgetItem key={index} budget={budget} />
      )) : [1, 2, 3].map((item, index) => (
          <div key={index} className='w-full bg-slate-200 rounded-lg h-[150px] animate-pulse'></div>
        ))}
    </div>
  );
}

export default BudgetList;