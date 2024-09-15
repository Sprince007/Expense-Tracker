"use client";
import React, { useState, useEffect } from 'react';
import BudgetList from './_components/BudgetList';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Incomes, Budgets, Expenses } from '@/utils/schema';

function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortBudgets();
  }, [searchTerm, sortCriteria, sortOrder, budgets]);

  const fetchBudgets = async () => {
    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpent: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      incomeName: Incomes.name // Fetch the name of the linked income
    })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .leftJoin(Incomes, eq(Budgets.incomeId, Incomes.id)) // Join with Incomes to get the income name
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id, Incomes.name) // Group by Incomes.name as well
      .orderBy(desc(Budgets.id));

    setBudgets(result);
  };

  const filterAndSortBudgets = () => {
    let filtered = budgets;

    if (searchTerm) {
      filtered = filtered.filter(budget =>
        budget.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortCriteria === 'amount') {
      filtered.sort((a, b) => sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount);
    } else if (sortCriteria === 'createdAt') {
      filtered.sort((a, b) => sortOrder === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredBudgets(filtered);
  };

  const exportBudgets = () => {
    const csvHeader = '"ID","Name","Amount","Total Spent","Total Items"';
    const csvRows = filteredBudgets.map(budget => [
      budget.id, budget.name, budget.amount, budget.totalSpent, budget.totalItem
    ].map(cell => `"${cell}"`).join(","));
    const csvContent = csvHeader + "\n" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "budgets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="font-bold text-2xl md:text-3xl mb-4 md:mb-0">My Budgets</h2>
        <button
          onClick={exportBudgets}
          className="bg-purple-500 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm md:text-base"
        >
          Export Budgets
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4 p-5">
        <input
          type="text"
          placeholder="Search budgets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="createdAt">Date</option>
          <option value="amount">Amount</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      {/* Make BudgetList responsive */}
      <div className="overflow-x-auto">
        <BudgetList budgets={filteredBudgets} refreshData={fetchBudgets} />
      </div>
    </div>
  );
}

export default Budget;
