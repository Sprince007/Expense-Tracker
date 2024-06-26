"use client";

import React, { useEffect, useState } from 'react';
import ExpenseListTable from './_components/ExpenseListTable'; // Adjust the import path if needed
import AddExpense from './_components/AddExpense'; // Adjust the import path if needed
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';

function Expense() {
  const [expensesList, setExpensesList] = useState([]);
  const [filteredExpensesList, setFilteredExpensesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('createdAt'); // Default sort by date
  const [sortOrder, setSortOrder] = useState('desc'); // Default sort order descending
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getAllExpenses();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortExpenses();
  }, [searchTerm, sortCriteria, sortOrder, expensesList]);

  const getAllExpenses = async () => {
    if (!user) return;

    const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt,
    }).from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));

    setExpensesList(result);
    setFilteredExpensesList(result);
  };

  const filterAndSortExpenses = () => {
    let filtered = expensesList;

    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortCriteria === 'amount') {
      filtered.sort((a, b) => sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount);
    } else if (sortCriteria === 'createdAt') {
      filtered.sort((a, b) => sortOrder === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredExpensesList(filtered);
  };

  const refreshData = () => {
    getAllExpenses();
  };

  const exportExpenses = () => {
    // Prepare CSV header
    const csvHeader = '"ID","Name","Amount","Created At"';

    // Prepare CSV rows with escaped commas
    const csvRows = filteredExpensesList.map(expense => [
      expense.id, expense.name, expense.amount, expense.createdAt
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
    link.setAttribute("download", "expenses.csv");

    // Append the link to the document body and click it
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
  };

  return (
    <div className='p-10'>
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-3xl p-3'>My Expenses</h1>
        <button
          onClick={exportExpenses}
          className='bg-purple-500 hover:bg-green-500 text-white px-4 py-1 rounded-xl'
        >
          Export Expenses
        </button>
      </div>
      <div className='mb-4 flex space-x-4'>
        <input
          type="text"
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="createdAt">Date</option>
          <option value="amount">Amount</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
     
      <ExpenseListTable expensesList={filteredExpensesList} refreshData={refreshData} />
    </div>
  );
}

export default Expense;
