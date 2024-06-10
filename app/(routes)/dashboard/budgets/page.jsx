"use client";
import React, { useState, useEffect } from 'react';
import BudgetList from './_components/BudgetList';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';

function Budget() {
  const [budgets, setBudgets] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user]);

  const fetchBudgets = async () => {
    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpent: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number)
    }).from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgets(result);
  };

  const exportBudgets = () => {
    // Prepare CSV header
    const csvHeader = '"ID","Name","Amount","Total Spent","Total Items"';

    // Prepare CSV rows with border styles
    const csvRows = budgets.map(budget => [
      budget.id, budget.name, budget.amount, budget.totalSpent, budget.totalItem
    ].map(cell => `"${cell}"`).join(","));

    // Combine header and rows with newline character
    const csvContent = csvHeader + "\n" + csvRows.join("\n");

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "budgets.csv");

    // Append the link to the document body and click it
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
  };

  return (
    <div className='p-10'>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-3xl'>My Budgets</h2>
        <button
          onClick={exportBudgets}
          className='bg-purple-500 hover:bg-green-500 text-white px-4 py-1 rounded-xl'
        >
          Export Budgets
        </button>
      </div>
      <BudgetList budgets={budgets} refreshData={fetchBudgets} />
    </div>
  );
}

export default Budget;
