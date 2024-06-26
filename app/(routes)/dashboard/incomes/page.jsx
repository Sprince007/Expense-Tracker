"use client";
import React, { useState, useEffect } from 'react';
import IncomeList from './_components/IncomeList';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Incomes, Budgets } from '@/utils/schema';

function Income() {
  const [incomes, setIncomes] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchIncomes();
    }
  }, [user]);

  const fetchIncomes = async () => {
    const result = await db.select({
      ...getTableColumns(Incomes),
      totalSpent: sql`sum(${Budgets.amount})`.mapWith(Number),
      totalItem: sql`count(${Budgets.id})`.mapWith(Number)
    }).from(Incomes)
      .leftJoin(Budgets, eq(Incomes.id, Budgets.incomeId))
      .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Incomes.id)
      .orderBy(desc(Incomes.id));

    setIncomes(result);
  };

  const exportIncomes = () => {
    // Prepare CSV header
    const csvHeader = '"ID","Name","Amount","Total Spent","Total Items"';

    // Prepare CSV rows with border styles
    const csvRows = incomes.map(income => [
      income.id, income.name, income.amount, income.totalSpent, income.totalItem
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
    link.setAttribute("download", "incomes.csv");

    // Append the link to the document body and click it
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
  };

  return (
    <div className='p-10'>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-3xl'>My Incomes
        <p className='text-sm font-medium text-gray-700 leading-tight'>Construct your Income, then elegantly embed your Budgets within.</p>
        </h2>
        <button
          onClick={exportIncomes}
          className='bg-purple-500 hover:bg-green-500 text-white px-4 py-1 rounded-xl'
        >
          Export Incomes
        </button>
      </div>
      <IncomeList incomes={incomes} refreshData={fetchIncomes} />
    </div>
  );
}

export default Income;
